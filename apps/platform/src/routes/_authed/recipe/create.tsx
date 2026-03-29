import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { type CreateRecipeInput, createRecipeSchema } from "@nutrilog/schema";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusIcon, Trash2Icon, Wand2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetIngredients } from "@/modules/ingredient/useIngredient";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_authed/recipe/create")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Recipe",
			module_path: "/recipe/create",
			action: "Create",
		},
	},
});

function RouteComponent() {
	const [isGenerating, setIsGenerating] = useState(false);

	const { data: ingredients } = useGetIngredients();
	const {
		register,
		reset,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			name: "",
			instruction: "",
			ingredients: [
				{
					ingredient_id: "",
					quantity: "",
				},
			],
		},
		resolver: standardSchemaResolver(createRecipeSchema),
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: "ingredients",
	});

	const recipeName = watch("name");

	// Generate instruction mutation
	const generateMutation = useMutation({
		mutationFn: async (name: string) => {
			const response = await api.recipes.instruction.$post({ json: { name } });

			if (!response.ok) {
				// const error = await response.json();
				throw new Error("Gagal generate instruksi");
			}

			const result = await response.json();
			return result.data?.instruction || "";
		},
	});

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ["recipe", "create"],
		mutationFn: async (data: CreateRecipeInput) => {
			return await api.recipes.$post({ json: data });
		},
		onSuccess: () => {
			toast.success("Recipe created.");
			reset();
		},
	});

	const handleGenerateInstruction = async () => {
		if (!recipeName?.trim()) {
			toast.error("Masukkan nama resep terlebih dahulu");
			return;
		}

		setIsGenerating(true);
		try {
			const instruction = await generateMutation.mutateAsync(recipeName);
			setValue("instruction", instruction);
			toast.success("Instruksi berhasil digenerate!");
		} catch (error) {
			console.error("AI generation error:", error);
			toast.error(
				error instanceof Error ? error.message : "Gagal generate instruksi",
			);
		} finally {
			setIsGenerating(false);
		}
	};
	const navigate = useNavigate();

	const onSubmit = handleSubmit(async (data) => {
		await mutateAsync(data);
		navigate({
			to: "/recipe",
		});
	});

	return (
		<div>
			<form onSubmit={onSubmit}>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="name">Recipe Name</FieldLabel>
						<Input
							{...register("name")}
							placeholder="Contoh: Sayur Sop, Sate Ayam, dll"
						/>
						{errors.name?.message && (
							<FieldError>{errors.name?.message}</FieldError>
						)}
					</Field>
					<Field>
						<div className="flex items-center justify-between mb-2">
							<FieldLabel htmlFor="instruction">Instruction</FieldLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleGenerateInstruction}
								disabled={isGenerating || !recipeName?.trim()}
								className="flex items-center gap-2"
							>
								<Wand2Icon className="size-4" />
								{isGenerating ? "Generating..." : "Generate AI"}
							</Button>
						</div>
						<Textarea
							{...register("instruction")}
							placeholder="Instruksi memasak akan muncul di sini setelah di-generate oleh AI"
							rows={10}
							className="min-h-50"
						/>
						{errors.instruction?.message && (
							<FieldError>{errors.instruction?.message}</FieldError>
						)}
					</Field>
					<Field>
						<FieldLabel>Ingredients</FieldLabel>
						{fields.map((field, index) => (
							<div key={field.id} className="flex gap-2 mb-2 items-end">
								<div className="flex-1">
									<Controller
										control={control}
										name={`ingredients.${index}.ingredient_id`}
										render={({ field: controllerField }) => (
											<Select
												onValueChange={controllerField.onChange}
												value={controllerField.value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select ingredient" />
												</SelectTrigger>
												<SelectContent>
													{ingredients?.ingredients?.map((ingredient) => (
														<SelectItem
															key={ingredient.id}
															value={ingredient.id}
														>
															{ingredient.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>
								<div className="flex-1">
									<Input
										{...register(`ingredients.${index}.quantity`)}
										placeholder="Quantity"
									/>
								</div>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => remove(index)}
								>
									<Trash2Icon className="size-4" />
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => append({ ingredient_id: "", quantity: "" })}
						>
							<PlusIcon className="size-4 mr-2" />
							Add Ingredient
						</Button>
					</Field>
					<Field>
						<Button disabled={isPending} type="submit">
							{isPending ? "Creating..." : "Create Recipe"}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
