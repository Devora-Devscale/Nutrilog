import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useDeleteRecipe,
	useGetRecipes,
} from "@/modules/recipe/hooks/useRecipe";

export const Route = createFileRoute("/_authed/recipe/")({
	component: RecipePage,
});

function RecipePage() {
	const { data: recipes = [], isLoading } = useGetRecipes();
	const deleteRecipe = useDeleteRecipe();

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this recipe?")) return;
		deleteRecipe.mutate(id, {
			onSuccess: () => toast.success("Recipe deleted!"),
			onError: () => toast.error("Failed to delete recipe"),
		});
	};
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
								<TableCell className="font-medium">{recipe.name}</TableCell>
								<TableCell className="flex gap-2">
									{/* <Dialog
										open={openEdit && selectedRecipe?.id === recipe.id}
										onOpenChange={(open) => {
											setOpenEdit(open);
											if (!open) setSelectedRecipe(null);
										}}
									>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												onClick={() => openEditDialog(recipe)}
											>
												Edit
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Edit Recipe</DialogTitle>
											</DialogHeader>
											<RecipeForm
												onSubmit={handleUpdate}
												submitLabel="Save Changes"
												isPending={updateRecipe.isPending}
											/>
										</DialogContent>
									</Dialog> */}
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(recipe.id)}
										disabled={deleteRecipe.isPending}
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
