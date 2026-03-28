import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { Ingredient } from "@nutrilog/api/dist/src/generated/prisma/client";
import {
	type CreateIngredientInput,
	createIngredientSchema,
} from "@nutrilog/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useDeleteIngredient,
	useGetIngredients,
	// useUpdateIngredient,
} from "@/modules/ingredient/hooks/useIngredient";
import { useGetUnitsQuery } from "@/routes/_authed/unit/-hook";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_authed/ingredient/")({
	component: IngredientPage,
});

// const defaultForm = { name: "", minimum: 0, stock: 0, unit_id: "" };

function IngredientPage() {
	const { data: { ingredients = [] } = {}, isLoading } = useGetIngredients();
	const { data: { data: units = [] } = {} } = useGetUnitsQuery();
	// const updateIngredient = useUpdateIngredient();
	const deleteIngredient = useDeleteIngredient();

	// const [openEdit, setOpenEdit] = useState(false);
	// const [selectedIngredient, setSelectedIngredient] =
	useState<Ingredient | null>(null);
	// const [form, setForm] = useState(defaultForm);

	// const handleUpdate = () => {
	// 	if (!selectedIngredient) return;
	// 	updateIngredient.mutate(
	// 		{ id: selectedIngredient.id, data: form },
	// 		{
	// 			onSuccess: () => {
	// 				toast.success("Ingredient updated!");
	// 				setOpenEdit(false);
	// 				setForm(defaultForm);
	// 			},
	// 			onError: () => toast.error("Failed to update ingredient"),
	// 		},
	// 	);
	// };

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this ingredient?")) return;
		deleteIngredient.mutate(id, {
			onSuccess: () => toast.success("Ingredient deleted!"),
			onError: () => toast.error("Failed to delete ingredient"),
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Ingredients</h1>
				<IngredientCreateModal />
			</div>

			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead>Minimum</TableHead>
							<TableHead>Unit</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ingredients.map((ingredient) => {
							const unit = units.find((u) => u.id === ingredient.unit_id);
							return (
								<TableRow key={ingredient.id}>
									<TableCell>{ingredient.name}</TableCell>
									<TableCell>{ingredient.stock}</TableCell>
									<TableCell>{ingredient.minimum}</TableCell>
									<TableCell>{unit?.name || ingredient.unit_id}</TableCell>
									<TableCell className="flex gap-2">
										{/* <Dialog
											open={
												openEdit && selectedIngredient?.id === ingredient.id
											}
											onOpenChange={(open) => {
												setOpenEdit(open);
												if (!open) setSelectedIngredient(null);
											}}
										>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setSelectedIngredient(ingredient);
														setForm({
															name: ingredient.name,
															minimum: ingredient.minimum,
															stock: ingredient.stock,
															unit_id: ingredient.unit_id,
														});
														setOpenEdit(true);
													}}
												>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Edit Ingredient</DialogTitle>
												</DialogHeader>
												<IngredientForm
													onSubmit={handleUpdate}
													submitLabel="Save Changes"
													isPending={updateIngredient.isPending}
												/>
											</DialogContent>
										</Dialog> */}
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(ingredient.id)}
											disabled={deleteIngredient.isPending}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
const IngredientCreateModal = () => {
	const queryClient = useQueryClient();

	const [open, setOpen] = useState<boolean>(false);
	const { data: { data: units = [] } = {} } = useGetUnitsQuery();
	const {
		register,
		reset,
		control,
		formState: { errors },
		handleSubmit,
	} = useForm({
		defaultValues: {
			name: "",
			minimum: 0,
			stock: 0,
			unit_id: "",
		},
		resolver: standardSchemaResolver(createIngredientSchema),
		mode: "onChange",
	});
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ["ingredient", "create"],
		mutationFn: async (data: CreateIngredientInput) => {
			return await api.ingredients.$post({ json: data });
		},
		onSuccess: () => {
			toast.success("Success add new ingredient");
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
			setTimeout(() => {
				reset();
				setOpen(false);
			}, 500);
		},
	});
	const onSubmit = handleSubmit(async (data) => {
		await mutateAsync(data);
	});

	const onOpenChange = () => {
		setOpen(!open);
		reset();
	};
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger>
				<Button size={"sm"}>Add Ingredient</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Ingredient</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmit}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input {...register("name")} />
							{errors.name?.message && (
								<FieldError>{errors.name?.message}</FieldError>
							)}
						</Field>
						<Field>
							<FieldLabel htmlFor="minimum">Minimum</FieldLabel>
							<Input {...register("minimum", { valueAsNumber: true })} />
							{errors.minimum?.message && (
								<FieldError>{errors.minimum?.message}</FieldError>
							)}
						</Field>
						<Field>
							<FieldLabel htmlFor="unit">Unit</FieldLabel>
							<Controller
								control={control}
								name="unit_id"
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Select unit" />
										</SelectTrigger>
										<SelectContent>
											{units.map((unit) => (
												<SelectItem key={unit.id} value={unit.id}>
													{unit.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.unit_id?.message && (
								<FieldError>{errors.unit_id?.message}</FieldError>
							)}
						</Field>

						<Field>
							<Button disabled={isPending} type="submit">
								{isPending ? "Creating..." : "Create Ingredient"}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
};
