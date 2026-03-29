import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	createSchoolSchema,
	type UpdateSchoolInput,
	updateSchoolSchema,
} from "@nutrilog/schema";
import { createFileRoute } from "@tanstack/react-router";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateSchool,
	useDeleteSchool,
	useGetSchools,
	useUpdateSchool,
} from "@/modules/school/useSchool";

export const Route = createFileRoute("/_authed/school/")({
	component: SchoolPage,
	staticData: {
		crumb: { module: "School" },
	},
});

function SchoolPage() {
	const { data: schools = [], isLoading } = useGetSchools();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Schools</h1>
				<CreateSchoolDialog />
			</div>

			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{schools.map((school) => (
							<TableRow key={school.id}>
								<TableCell>{school.name}</TableCell>
								<TableCell>{school.address}</TableCell>
								<TableCell className="flex gap-2">
									<UpdateSchoolDialog data={school} />
									<DeleteSchoolDialog data={school} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
const CreateSchoolDialog = () => {
	const [openCreate, setOpenCreate] = useState(false);
	const {
		reset,
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		defaultValues: {
			name: "",
			address: "",
		},
		resolver: standardSchemaResolver(createSchoolSchema),
	});
	const { mutateAsync, isPending } = useCreateSchool();

	const handleCreate = handleSubmit(async (data) => {
		await mutateAsync(data);
		setOpenCreate(false);
		reset();
	});
	return (
		<Dialog open={openCreate} onOpenChange={setOpenCreate}>
			<DialogTrigger asChild>
				<Button size={"sm"}>Add School</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New School</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<Field>
						<FieldLabel>School Name</FieldLabel>
						<Input placeholder="School name" {...register("name")} />
						{errors.name?.message && (
							<FieldError>{errors.name?.message}</FieldError>
						)}
					</Field>
					<Field>
						<FieldLabel>Address</FieldLabel>
						<Textarea placeholder="Address" {...register("address")} />
						{errors.address?.message && (
							<FieldError>{errors.address?.message}</FieldError>
						)}
					</Field>
					<Button onClick={handleCreate} disabled={isPending}>
						{isPending ? "Saving..." : "Save"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
const UpdateSchoolDialog = ({ data }: { data: UpdateSchoolInput }) => {
	const [openUpdate, setOpenUpdate] = useState(false);
	const {
		reset,
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		defaultValues: {
			id: data.id,
			name: data.name,
			address: data.address,
		},
		resolver: standardSchemaResolver(updateSchoolSchema),
	});
	const { mutateAsync, isPending } = useUpdateSchool(data.id);

	const handleCreate = handleSubmit(async (data) => {
		await mutateAsync(data);
		setOpenUpdate(false);
		reset();
	});
	return (
		<Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
			<DialogTrigger asChild>
				<Button variant={"outline"} size={"sm"}>
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update School</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<Field>
						<FieldLabel>School Name</FieldLabel>
						<Input placeholder="School name" {...register("name")} />
						{errors.name?.message && (
							<FieldError>{errors.name?.message}</FieldError>
						)}
					</Field>
					<Field>
						<FieldLabel>Address</FieldLabel>
						<Textarea placeholder="Address" {...register("address")} />
						{errors.address?.message && (
							<FieldError>{errors.address?.message}</FieldError>
						)}
					</Field>
					<Button onClick={handleCreate} disabled={isPending}>
						{isPending ? "Saving..." : "Save"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
const DeleteSchoolDialog = ({ data }: { data: UpdateSchoolInput }) => {
	const [openDelete, setOpenDelete] = useState(false);

	const { mutateAsync, isPending } = useDeleteSchool(data.id);

	const handleDelete = async () => {
		await mutateAsync();
		setOpenDelete(false);
	};

	return (
		<Dialog open={openDelete} onOpenChange={setOpenDelete}>
			<DialogTrigger asChild>
				<Button variant={"destructive"} size={"sm"}>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete School</DialogTitle>
				</DialogHeader>
				Do you want to delete {data.name}?
				<Button
					variant={"destructive"}
					onClick={handleDelete}
					disabled={isPending}
				>
					{isPending ? "Deleting..." : "Delete"}
				</Button>
			</DialogContent>
		</Dialog>
	);
};
