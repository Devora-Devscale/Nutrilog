import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetRecipes } from "@/modules/recipe/useRecipe";
import { useGetSchools } from "@/modules/school/useSchool";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_authed/meal-plan/create")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Meal Plan",
			action: "Create",
			module_path: "/meal-plan/create",
		},
	},
});

type IngredientWithRelation = {
	id: string;
	name: string;
	minimum: number;
	stock: number;
	unit_id: string;
	created_at: Date;
};

type IngredientRecipeWithRelation = {
	id: string;
	ingredient_id: string;
	recipe_id: string;
	quantity: number;
	ingredient: IngredientWithRelation;
};

type RecipeWithIngredients = {
	id: string;
	name: string;
	instruction: string;
	created_at: Date;
	ingredientRecipes: IngredientRecipeWithRelation[];
};

type SchoolWithId = {
	id: string;
	name: string;
	address: string;
	created_at: Date;
};

type SchoolPortion = {
	school_id: string;
	school_name: string;
	portion: number;
};

type FormValues = {
	date: string;
	received_time: string;
	recipe_id: string;
	schools: SchoolPortion[];
};

type IngredientCalc = {
	id: string;
	name: string;
	unit: string;
	quantityPerPortion: number;
	totalNeeded: string;
	currentStock: number;
};

function RouteComponent() {
	const { data: schoolsData } = useGetSchools() as {
		data: SchoolWithId[] | undefined;
	};
	const { data: recipes = [] } = useGetRecipes() as {
		data: RecipeWithIngredients[] | undefined;
	};

	const schools = schoolsData ?? [];

	const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");

	const selectedRecipe = recipes?.find((r) => r.id === selectedRecipeId);

	const { register, control, handleSubmit, watch, setValue, reset } =
		useForm<FormValues>({
			defaultValues: {
				date: new Date().toISOString().split("T")[0],
				received_time: new Date().toISOString().slice(0, 16),
				recipe_id: "",
				schools: [],
			},
		});

	const { fields, append, update } = useFieldArray({
		control,
		name: "schools",
	});

	useEffect(() => {
		if (schools.length > 0 && fields.length === 0) {
			append(
				schools.map((s) => ({
					school_id: s.id,
					school_name: s.name,
					portion: 0,
				})),
			);
		}
	}, [schools, fields.length, append]);

	const watchedSchools = watch("schools");

	const totalPortion = useMemo(() => {
		return watchedSchools.reduce(
			(sum, school) => sum + (Number(school.portion) || 0),
			0,
		);
	}, [watchedSchools]);

	const ingredientCalculation = useMemo((): IngredientCalc[] => {
		if (
			!selectedRecipe ||
			!selectedRecipe.ingredientRecipes ||
			totalPortion === 0
		) {
			return [];
		}

		const ingredientRecipes = selectedRecipe.ingredientRecipes;
		return ingredientRecipes.map((ir) => {
			const ingredient = ir.ingredient;
			const quantity = ir.quantity || 0;
			const totalNeeded = quantity * totalPortion;

			return {
				id: ingredient?.id || ir.ingredient_id,
				name: ingredient?.name || "Unknown",
				unit: ingredient?.unit_id || "",
				quantityPerPortion: quantity,
				totalNeeded: totalNeeded.toFixed(2),
				currentStock: ingredient?.stock || 0,
			};
		});
	}, [selectedRecipe, totalPortion]);

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ["meal-plan", "create"],
		mutationFn: async (data: FormValues) => {
			const mealPlans = data.schools
				.filter((s) => s.portion > 0)
				.map((school) => ({
					date: new Date(`${data.date}T00:00:00.000Z`).toISOString(),
					received_time: new Date(data.received_time).toISOString(),
					status: "PENDING" as const,
					portion: Number(school.portion),
					receipt_photo: "",
					school_id: school.school_id,
					recipe_id: data.recipe_id,
				}));

			const res = await api["meal-plans"].$post({ json: mealPlans });
			return await res.json();
		},
		onSuccess: () => {
			toast.success("Meal plans created!");
			reset();
		},
		onError: () => {
			toast.error("Failed to create meal plans");
		},
	});
	const navigate = useNavigate();
	const onSubmit = handleSubmit(async (data) => {
		await mutateAsync(data);
		navigate({
			to: "/meal-plan",
		});
	});

	const handlePortionChange = (index: number, value: string) => {
		const num = parseInt(value, 10) || 0;
		update(index, { ...fields[index], portion: num });
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Create Meal Plan</h1>

			<form onSubmit={onSubmit}>
				<div className="grid grid-cols-2 gap-6">
					<div className="flex flex-col gap-4">
						<Field>
							<FieldLabel>Date</FieldLabel>
							<Input type="date" {...register("date")} />
						</Field>

						<Field>
							<FieldLabel>Received Time</FieldLabel>
							<Input type="datetime-local" {...register("received_time")} />
						</Field>

						<Field>
							<FieldLabel>Recipe</FieldLabel>
							<Select
								value={selectedRecipeId}
								onValueChange={(value) => {
									setSelectedRecipeId(value);
									setValue("recipe_id", value);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select recipe" />
								</SelectTrigger>
								<SelectContent>
									{recipes?.map((recipe) => (
										<SelectItem key={recipe.id} value={recipe.id}>
											{recipe.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						<Field>
							<FieldLabel>Schools & Portions</FieldLabel>
							<div className="border rounded-md max-h-100 overflow-y-auto">
								{fields.map((field, index) => (
									<div
										key={field.id}
										className="flex items-center gap-2 p-2 border-b last:border-b-0"
									>
										<span className="flex-1 text-sm">{field.school_name}</span>
										<Input
											type="number"
											min="0"
											className="w-24"
											value={watchedSchools[index]?.portion || ""}
											onChange={(e) =>
												handlePortionChange(index, e.target.value)
											}
											placeholder="Portion"
										/>
									</div>
								))}
							</div>
							<div className="mt-2 text-sm font-medium">
								Total Portion: {totalPortion}
							</div>
						</Field>
					</div>

					<div className="flex flex-col gap-4">
						<Field>
							<FieldLabel>Ingredient Calculation</FieldLabel>
							{totalPortion === 0 ? (
								<p className="text-muted-foreground text-sm">
									Set portions for schools to see ingredient calculations
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Ingredient</TableHead>
											<TableHead>Qty/Portion</TableHead>
											<TableHead>Total Needed</TableHead>
											<TableHead>Current Stock</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{ingredientCalculation.map((calc) => (
											<TableRow key={calc.id}>
												<TableCell>{calc.name}</TableCell>
												<TableCell>{calc.quantityPerPortion}</TableCell>
												<TableCell>{calc.totalNeeded}</TableCell>
												<TableCell
													className={
														parseFloat(calc.totalNeeded) > calc.currentStock
															? "text-red-500"
															: ""
													}
												>
													{calc.currentStock}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</Field>
					</div>
				</div>

				<div className="mt-6">
					<Button type="submit" disabled={isPending || totalPortion === 0}>
						{isPending ? "Creating..." : "Create Meal Plans"}
					</Button>
				</div>
			</form>
		</div>
	);
}
