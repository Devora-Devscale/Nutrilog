import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	type CreateUnitInput,
	type UpdateUnitInput,
	updateUnitSchema,
} from "@nutrilog/schema";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
	useCreateUnitForm,
	useCreateUnitMutation,
	useDeleteUnitMutation,
	useGetUnitsQuery,
	useUpdateUnitMutation,
} from "./-hook";

export const Route = createFileRoute("/_authed/unit/")({
	component: UnitPage,
	staticData: {
		crumb: { module: "Unit", action: "List", module_path: "/_authed/unit" },
	},
});

function UnitPage() {
	const { data, isLoading } = useGetUnitsQuery();

	const units = (data as { data: { id: string; name: string }[] })?.data ?? [];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Units</h1>
				<CreateUnitModal />
			</div>

			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{units.map((unit: { id: string; name: string }) => (
							<TableRow key={unit.id}>
								<TableCell>{unit.name}</TableCell>
								<TableCell className="flex gap-2">
									<UpdateUnitModal data={unit} />
									<DeleteUnitModal id={unit.id} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}

const CreateUnitModal = () => {
	const [openCreate, setOpenCreate] = useState(false);

	const { mutateAsync: createUnitAsync, isPending: isCreatePending } =
		useCreateUnitMutation();
	const {
		register,
		formState: { errors },
		reset,
		handleSubmit: handleCreate,
	} = useCreateUnitForm();
	const onCreateSubmit = handleCreate(async (data: CreateUnitInput) => {
		await createUnitAsync(data);
		reset();
		setOpenCreate(false);
	});
	return (
		<Dialog open={openCreate} onOpenChange={setOpenCreate}>
			<DialogTrigger asChild>
				<Button>Add Unit</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Unit</DialogTitle>
				</DialogHeader>
				<form onSubmit={onCreateSubmit} className="flex flex-col gap-3">
					<Input placeholder="Unit name" {...register("name")} />
					{errors.name && (
						<p className="text-sm text-red-500">{errors.name.message}</p>
					)}
					<Button type="submit" disabled={isCreatePending}>
						{isCreatePending ? "Saving..." : "Save"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
const UpdateUnitModal = ({ data }: { data: UpdateUnitInput }) => {
	const { mutateAsync: updateUnitAsync, isPending: isUpdatePending } =
		useUpdateUnitMutation();
	const {
		reset,
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: standardSchemaResolver(updateUnitSchema),
		defaultValues: { name: data.name, id: data.id },
	});
	const [openEdit, setOpenEdit] = useState(false);

	const onEditSubmit = async (data: UpdateUnitInput) => {
		await updateUnitAsync(data);
		reset();
		setOpenEdit(false);
	};
	return (
		<Dialog
			open={openEdit}
			onOpenChange={(open) => {
				setOpenEdit(open);
				if (!open) {
					reset();
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						setOpenEdit(true);
					}}
				>
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Unit</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onEditSubmit)}
					className="flex flex-col gap-3"
				>
					<Input placeholder="Unit name" {...register("name")} />
					{errors.name && (
						<p className="text-sm text-red-500">{errors.name.message}</p>
					)}
					<Button type="submit" disabled={isUpdatePending}>
						{isUpdatePending ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
const DeleteUnitModal = ({ id }: { id: string }) => {
	const { mutateAsync: deleteUnitAsync, isPending: isDeletePending } =
		useDeleteUnitMutation();

	const [openDelete, setOpenDelete] = useState(false);

	const onDeleteSubmit = async (e: React.MouseEvent) => {
		e.preventDefault();
		await deleteUnitAsync(id);
		setOpenDelete(false);
	};
	return (
		<Dialog
			open={openDelete}
			onOpenChange={(open) => {
				setOpenDelete(open);
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant={"destructive"}
					size="sm"
					onClick={() => {
						setOpenDelete(true);
					}}
				>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure want to delete this Unit?</DialogTitle>
				</DialogHeader>
				<Button
					variant={"destructive"}
					size={"sm"}
					onClick={onDeleteSubmit}
					disabled={isDeletePending}
				>
					{isDeletePending ? "Deleting..." : "Delete"}
				</Button>
				<Button
					variant={"outline"}
					size={"sm"}
					onClick={() => setOpenDelete(false)}
					disabled={isDeletePending}
				>
					Cancel
				</Button>
			</DialogContent>
		</Dialog>
	);
};
