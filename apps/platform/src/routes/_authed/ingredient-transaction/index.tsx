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
	useCreateIngredientTransaction,
	useDeleteIngredientTransaction,
	useGetIngredientTransactions,
	useUpdateIngredientTransaction,
} from "@/modules/ingredient-transaction/hooks/useIngredientTransaction";

export const Route = createFileRoute("/_authed/ingredient-transaction/")({
	component: IngredientTransactionPage,
	staticData: {
		crumb: {
			module: "Stocks",
		},
	},
});

type IngredientTransaction = {
	id: string;
	out: number;
	in: number;
	current_stock: number;
	ingredient_id: string;
	created_at: string;
};

const defaultForm = { out: 0, in: 0, current_stock: 0, ingredient_id: "" };

function IngredientTransactionPage() {
	const { data, isLoading } = useGetIngredientTransactions();
	const createTransaction = useCreateIngredientTransaction();
	const updateTransaction = useUpdateIngredientTransaction();
	const deleteTransaction = useDeleteIngredientTransaction();

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<IngredientTransaction | null>(null);
	const [form, setForm] = useState(defaultForm);

	const transactions =
		(data as { ingredientTransactions: IngredientTransaction[] })
			?.ingredientTransactions ?? [];

	const handleCreate = () => {
		createTransaction.mutate(form, {
			onSuccess: () => {
				toast.success("Transaction created!");
				setOpenCreate(false);
				setForm(defaultForm);
			},
			onError: () => toast.error("Failed to create transaction"),
		});
	};

	const handleUpdate = () => {
		if (!selected) return;
		updateTransaction.mutate(
			{ id: selected.id, data: form },
			{
				onSuccess: () => {
					toast.success("Transaction updated!");
					setOpenEdit(false);
					setForm(defaultForm);
				},
				onError: () => toast.error("Failed to update transaction"),
			},
		);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this transaction?")) return;
		deleteTransaction.mutate(id, {
			onSuccess: () => toast.success("Stock deleted!"),
			onError: () => toast.error("Failed to delete transaction"),
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Stock</h1>
				<Dialog open={openCreate} onOpenChange={setOpenCreate}>
					<DialogTrigger asChild>
						<Button>Add Stock</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Transaction</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-3">
							<Input
								type="number"
								placeholder="Out"
								value={form.out}
								onChange={(e) =>
									setForm({ ...form, out: Number(e.target.value) })
								}
							/>
							<Input
								type="number"
								placeholder="In"
								value={form.in}
								onChange={(e) =>
									setForm({ ...form, in: Number(e.target.value) })
								}
							/>
							<Input
								type="number"
								placeholder="Current Stock"
								value={form.current_stock}
								onChange={(e) =>
									setForm({ ...form, current_stock: Number(e.target.value) })
								}
							/>
							<Input
								placeholder="Ingredient ID"
								value={form.ingredient_id}
								onChange={(e) =>
									setForm({ ...form, ingredient_id: e.target.value })
								}
							/>
							<Button
								onClick={handleCreate}
								disabled={createTransaction.isPending}
							>
								{createTransaction.isPending ? "Saving..." : "Save"}
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
							<TableHead>Ingredient ID</TableHead>
							<TableHead>In</TableHead>
							<TableHead>Out</TableHead>
							<TableHead>Current Stock</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map((transaction) => (
							<TableRow key={transaction.id}>
								<TableCell>{transaction.ingredient_id}</TableCell>
								<TableCell>{transaction.in}</TableCell>
								<TableCell>{transaction.out}</TableCell>
								<TableCell>{transaction.current_stock}</TableCell>
								<TableCell className="flex gap-2">
									<Dialog
										open={openEdit && selected?.id === transaction.id}
										onOpenChange={(open) => {
											setOpenEdit(open);
											if (!open) setSelected(null);
										}}
									>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setSelected(transaction);
													setForm({
														out: transaction.out,
														in: transaction.in,
														current_stock: transaction.current_stock,
														ingredient_id: transaction.ingredient_id,
													});
													setOpenEdit(true);
												}}
											>
												Edit
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Edit Transaction</DialogTitle>
											</DialogHeader>
											<div className="flex flex-col gap-3">
												<Input
													type="number"
													placeholder="Out"
													value={form.out}
													onChange={(e) =>
														setForm({ ...form, out: Number(e.target.value) })
													}
												/>
												<Input
													type="number"
													placeholder="In"
													value={form.in}
													onChange={(e) =>
														setForm({ ...form, in: Number(e.target.value) })
													}
												/>
												<Input
													type="number"
													placeholder="Current Stock"
													value={form.current_stock}
													onChange={(e) =>
														setForm({
															...form,
															current_stock: Number(e.target.value),
														})
													}
												/>
												<Input
													placeholder="Ingredient ID"
													value={form.ingredient_id}
													onChange={(e) =>
														setForm({ ...form, ingredient_id: e.target.value })
													}
												/>
												<Button
													onClick={handleUpdate}
													disabled={updateTransaction.isPending}
												>
													{updateTransaction.isPending
														? "Saving..."
														: "Save Changes"}
												</Button>
											</div>
										</DialogContent>
									</Dialog>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(transaction.id)}
										disabled={deleteTransaction.isPending}
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
