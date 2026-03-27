import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useCreateIngredient,
	useDeleteIngredient,
	useGetIngredients,
	useUpdateIngredient,
} from "@/modules/ingredient/hooks/useIngredient";
import { useGetUnitsQuery } from "@/routes/_authed/unit/-hook";

export const Route = createFileRoute("/_authed/ingredient/")({
	component: IngredientPage,
});

type Unit = {
	id: string;
	name: string | null;
};

type Ingredient = {
	id: string;
	name: string;
	minimum: number;
	stock: number;
	unit_id: string;
};

const defaultForm = { name: "", minimum: 0, stock: 0, unit_id: "" };

function IngredientPage() {
	const { data, isLoading } = useGetIngredients();
	const { data: unitsData } = useGetUnitsQuery();
	const createIngredient = useCreateIngredient();
	const updateIngredient = useUpdateIngredient();
	const deleteIngredient = useDeleteIngredient();

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedIngredient, setSelectedIngredient] =
		useState<Ingredient | null>(null);
	const [form, setForm] = useState(defaultForm);

	const ingredients =
		(data as { ingredients: Ingredient[] })?.ingredients ?? [];
	const units = (unitsData as { units?: Unit[] })?.units ?? [];

	const handleCreate = () => {
		createIngredient.mutate(form, {
			onSuccess: () => {
				toast.success("Ingredient created!");
				setOpenCreate(false);
				setForm(defaultForm);
			},
			onError: () => toast.error("Failed to create ingredient"),
		});
	};

	const handleUpdate = () => {
		if (!selectedIngredient) return;
		updateIngredient.mutate(
			{ id: selectedIngredient.id, data: form },
			{
				onSuccess: () => {
					toast.success("Ingredient updated!");
					setOpenEdit(false);
					setForm(defaultForm);
				},
				onError: () => toast.error("Failed to update ingredient"),
			},
		);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this ingredient?")) return;
		deleteIngredient.mutate(id, {
			onSuccess: () => toast.success("Ingredient deleted!"),
			onError: () => toast.error("Failed to delete ingredient"),
		});
	};

	const IngredientForm = ({
		onSubmit,
		submitLabel,
		isPending,
	}: {
		onSubmit: () => void;
		submitLabel: string;
		isPending: boolean;
	}) => (
		<div className="flex flex-col gap-3">
			<Input
				placeholder="Name"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
			/>
			<Input
				type="number"
				placeholder="Minimum stock"
				value={form.minimum}
				onChange={(e) =>
					setForm({ ...form, minimum: Number(e.target.value) })
				}
			/>
			<Input
				type="number"
				placeholder="Current stock"
				value={form.stock}
				onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
			/>
			<select
				className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				value={form.unit_id}
				onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
			>
				<option value="">Select Unit</option>
				{units.map((unit) => (
					<option key={unit.id} value={unit.id}>
						{unit.name || "Unnamed Unit"}
					</option>
				))}
			</select>
			<Button onClick={onSubmit} disabled={isPending}>
				{isPending ? "Saving..." : submitLabel}
			</Button>
		</div>
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Ingredients</h1>
				<Dialog open={openCreate} onOpenChange={setOpenCreate}>
					<DialogTrigger asChild>
						<Button>Add Ingredient</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Ingredient</DialogTitle>
						</DialogHeader>
						<IngredientForm
							onSubmit={handleCreate}
							submitLabel="Save"
							isPending={createIngredient.isPending}
						/>
					</DialogContent>
				</Dialog>
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
										<Dialog
											open={openEdit && selectedIngredient?.id === ingredient.id}
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
										</Dialog>
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
