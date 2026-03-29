import type { Recipe } from "@nutrilog/api/dist/src/generated/prisma/client";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { useDeleteRecipe, useGetRecipes } from "@/modules/recipe/useRecipe";

export const Route = createFileRoute("/_authed/recipe/")({
	component: RecipePage,
	staticData: {
		crumb: {
			module: "Recipe",
		},
	},
});

function RecipePage() {
	const { data: recipes = [], isLoading } = useGetRecipes();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Recipes</h1>
				<Link to="/recipe/create">
					<Button>Add Recipe</Button>
				</Link>
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
						{recipes.map((recipe) => (
							<TableRow key={recipe.id}>
								<TableCell>{recipe.name}</TableCell>
								<TableCell className="flex gap-2">
									<Link to="/recipe/$id/detail" params={{ id: recipe.id }}>
										<Button variant={"outline"} size={"sm"}>
											View
										</Button>
									</Link>

									<DeleteRecipeModal data={recipe} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
const DeleteRecipeModal = ({ data }: { data: Omit<Recipe, "created_at"> }) => {
	const { mutateAsync, isPending } = useDeleteRecipe();

	const [openDelete, setOpenDelete] = useState(false);

	const onDeleteSubmit = async (e: React.MouseEvent) => {
		e.preventDefault();
		await mutateAsync(data.id);
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
					<DialogTitle>
						Are you sure want to delete {data.name} recipe?
					</DialogTitle>
				</DialogHeader>
				<Button
					variant={"destructive"}
					size={"sm"}
					onClick={onDeleteSubmit}
					disabled={isPending}
				>
					{isPending ? "Deleting..." : "Delete"}
				</Button>
				<Button
					variant={"outline"}
					size={"sm"}
					onClick={() => setOpenDelete(false)}
					disabled={isPending}
				>
					Cancel
				</Button>
			</DialogContent>
		</Dialog>
	);
};
