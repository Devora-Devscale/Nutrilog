import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDeleteMealPlanMutation, useGetMealPlansQuery } from "./-hook";

export const Route = createFileRoute("/_authed/meal-plan/")({
	component: MealPlanPage,
	staticData: {
		crumb: {
			module: "Meal Plan",
			action: "List",
			module_path: "/_authed/meal-plan",
		},
	},
});

function MealPlanPage() {
	const { data: { meal_plans = [] } = {}, isLoading } = useGetMealPlansQuery();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Meal Plans</h1>
			</div>

			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Received Time</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Portion</TableHead>
							<TableHead>School ID</TableHead>
							<TableHead>Recipe ID</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{meal_plans.map((mealPlan) => (
							<TableRow key={mealPlan.id}>
								<TableCell>
									{new Date(mealPlan.date).toLocaleDateString()}
								</TableCell>
								<TableCell>
									{new Date(mealPlan.received_time).toLocaleString()}
								</TableCell>
								<TableCell>{mealPlan.status}</TableCell>
								<TableCell>{mealPlan.portion}</TableCell>
								<TableCell className="truncate max-w-[100px]">
									{mealPlan.school_id}
								</TableCell>
								<TableCell className="truncate max-w-[100px]">
									{mealPlan.recipe_id}
								</TableCell>
								<TableCell className="flex gap-2">
									<DeleteMealPlanModal id={mealPlan.id} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}

const DeleteMealPlanModal = ({ id }: { id: string }) => {
	const { mutateAsync: deleteMealPlanAsync, isPending: isDeletePending } =
		useDeleteMealPlanMutation();

	const [openDelete, setOpenDelete] = useState(false);

	const onDeleteSubmit = async (e: React.MouseEvent) => {
		e.preventDefault();
		await deleteMealPlanAsync(id);
		setOpenDelete(false);
	};
	return (
		<Dialog open={openDelete} onOpenChange={setOpenDelete}>
			<DialogTrigger asChild>
				<Button
					variant={"destructive"}
					size="sm"
					onClick={() => setOpenDelete(true)}
				>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure want to delete this Meal Plan?</DialogTitle>
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
