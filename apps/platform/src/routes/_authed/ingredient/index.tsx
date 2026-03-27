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

export const Route = createFileRoute("/_authed/ingredient/")({
	component: IngredientPage,
	staticData: {
		crumb: {
			module: "Ingredient",
			action: "List",
			module_path: "/_authed/ingredient",
		},
	},
});

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
								onChange={(e) =>
									setForm({ ...form, stock: Number(e.target.value) })
								}
							/>
							<Input
								placeholder="Unit ID"
								value={form.unit_id}
								onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
							/>
							<Button
								onClick={handleCreate}
								disabled={createIngredient.isPending}
							>
								{createIngredient.isPending ? "Saving..." : "Save"}
							</Button>
						</div>
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
							<TableHead>Unit ID</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ingredients.map((ingredient) => (
							<TableRow key={ingredient.id}>
								<TableCell>{ingredient.name}</TableCell>
								<TableCell>{ingredient.stock}</TableCell>
								<TableCell>{ingredient.minimum}</TableCell>
								<TableCell>{ingredient.unit_id}</TableCell>
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
											<div className="flex flex-col gap-3">
												<Input
													placeholder="Name"
													value={form.name}
													onChange={(e) =>
														setForm({ ...form, name: e.target.value })
													}
												/>
												<Input
													type="number"
													placeholder="Minimum stock"
													value={form.minimum}
													onChange={(e) =>
														setForm({
															...form,
															minimum: Number(e.target.value),
														})
													}
												/>
												<Input
													type="number"
													placeholder="Current stock"
													value={form.stock}
													onChange={(e) =>
														setForm({ ...form, stock: Number(e.target.value) })
													}
												/>
												<Input
													placeholder="Unit ID"
													value={form.unit_id}
													onChange={(e) =>
														setForm({ ...form, unit_id: e.target.value })
													}
												/>
												<Button
													onClick={handleUpdate}
													disabled={updateIngredient.isPending}
												>
													{updateIngredient.isPending
														? "Saving..."
														: "Save Changes"}
												</Button>
											</div>
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
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
