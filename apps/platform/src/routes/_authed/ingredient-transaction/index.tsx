import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	type CreateIngredientTransactionInput,
	createIngredientTransactionSchema,
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
import { useGetIngredients } from "@/modules/ingredient/useIngredient";
import {
	useDeleteIngredientTransaction,
	useGetIngredientTransactions,
} from "@/modules/ingredient-transaction/hooks/useIngredientTransaction";
import { api } from "@/utils/api";

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

function IngredientTransactionPage() {
	const {
		data: { ingredientTransactions: transactions = [] } = {},
		isLoading,
	} = useGetIngredientTransactions();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Stock</h1>
				<CreateIngredientTransactionDialog />
			</div>

			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Ingredient</TableHead>
							<TableHead>In</TableHead>
							<TableHead>Out</TableHead>
							<TableHead>Current Stock</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map((transaction) => (
							<TableRow key={transaction.id}>
								<TableCell>{transaction.ingredient.name}</TableCell>
								<TableCell>{transaction.in}</TableCell>
								<TableCell>{transaction.out}</TableCell>
								<TableCell>{transaction.current_stock}</TableCell>
								<TableCell className="flex gap-2">
									{/* <Dialog
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
												<DialogTitle>Edit Stock</DialogTitle>
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
									</Dialog> */}
									<DeleteIngredientTransactionDialog data={transaction} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
const CreateIngredientTransactionDialog = () => {
	const [openCreate, setOpenCreate] = useState(false);
	const { data: { ingredients = [] } = {} } = useGetIngredients();
	const {
		reset,
		register,
		formState: { errors },
		handleSubmit,
		control,
		watch,
	} = useForm({
		defaultValues: {
			out: 0,
			in: 0,
			ingredient_id: "",
		},
		resolver: standardSchemaResolver(createIngredientTransactionSchema),
	});
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ["create", "stock"],
		mutationFn: async (data: CreateIngredientTransactionInput) => {
			return await api["ingredient-transactions"].$post({ json: data });
		},
		onSuccess: () => {
			toast.success("Transaction added!");
			queryClient.invalidateQueries({ queryKey: ["ingredient-transactions"] });
			reset();
			setTimeout(() => {
				setOpenCreate(false);
			}, 250);
		},
	});
	const onSubmitHandler = handleSubmit(async (data) => {
		const ingredient_id = watch("ingredient_id");
		const ingredient = ingredients.find((item) => item.id === ingredient_id);

		if (!ingredient || ingredient.stock < data.out) {
			toast.error("Stock is not enough!");
			return;
		}

		await mutateAsync(data);
	});

	return (
		<Dialog open={openCreate} onOpenChange={setOpenCreate}>
			<DialogTrigger asChild>
				<Button>Add Stock</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Stock</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmitHandler}>
					<FieldGroup>
						<Field>
							<FieldLabel>Stock Keluar</FieldLabel>
							<Input {...register("out", { valueAsNumber: true })} />
							{errors.out && <FieldError>{errors.out.message}</FieldError>}
						</Field>
						<Field>
							<FieldLabel>Stock In</FieldLabel>
							<Input {...register("in", { valueAsNumber: true })} />
							{errors.in && <FieldError>{errors.in.message}</FieldError>}
						</Field>
						<Field>
							<FieldLabel>Ingredient</FieldLabel>
							<Controller
								control={control}
								name="ingredient_id"
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Select ingredient" />
										</SelectTrigger>
										<SelectContent>
											{ingredients.map((ingredient) => (
												<SelectItem key={ingredient.id} value={ingredient.id}>
													{ingredient.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.ingredient_id && (
								<FieldError>{errors.ingredient_id.message}</FieldError>
							)}
						</Field>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save"}
						</Button>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
};
const DeleteIngredientTransactionDialog = ({
	data,
}: {
	data: IngredientTransaction;
}) => {
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending } = useDeleteIngredientTransaction();
	const queryClient = useQueryClient();

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		await mutateAsync(data.id);
		queryClient.invalidateQueries({
			queryKey: ["ingredient-transactions"],
		});
		toast.success("Transaction deleted!");
		setOpen(false);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"destructive"} size={"sm"}>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Do you want to delete this transaction?</DialogTitle>
				</DialogHeader>
				<FieldGroup>
					<Button
						onClick={handleDelete}
						variant={"destructive"}
						disabled={isPending}
					>
						{isPending ? "Deleting..." : "Delete"}
					</Button>
				</FieldGroup>
			</DialogContent>
		</Dialog>
	);
};
