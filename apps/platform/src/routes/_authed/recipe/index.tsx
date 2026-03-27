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
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useCreateRecipe,
	useDeleteRecipe,
	useGetRecipes,
	useUpdateRecipe,
} from "@/modules/recipe/hooks/useRecipe";
import { useGetIngredients } from "@/modules/ingredient/hooks/useIngredient";

export const Route = createFileRoute("/_authed/recipe/")({
	component: RecipePage,
});

type Ingredient = {
	id: string;
	name: string;
	minimum: number;
	stock: number;
	unit_id: string;
};

type Recipe = {
	id: string;
	name: string;
	instruction: string;
	ingredientRecipes?: Array<{
		id: string;
		quantity: number;
		ingredient?: Ingredient;
	}>;
};

type IngredientInput = {
	ingredient_id: string;
	quantity: string;
};

const defaultForm = {
	name: "",
	instruction: "",
	ingredients: [] as IngredientInput[],
};

function RecipePage() {
	const { data, isLoading } = useGetRecipes();
	const { data: ingredientsData } = useGetIngredients();
	const createRecipe = useCreateRecipe();
	const updateRecipe = useUpdateRecipe();
	const deleteRecipe = useDeleteRecipe();

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const [form, setForm] = useState(defaultForm);

	const recipes = (data as { data?: Recipe[] })?.data ?? [];
	const ingredients =
		(ingredientsData as { ingredients?: Ingredient[] })?.ingredients ?? [];

	const handleCreate = () => {
		createRecipe.mutate(form, {
			onSuccess: () => {
				toast.success("Recipe created!");
				setOpenCreate(false);
				setForm(defaultForm);
			},
			onError: () => toast.error("Failed to create recipe"),
		});
	};

	const handleUpdate = () => {
		if (!selectedRecipe) return;
		updateRecipe.mutate(
			{ id: selectedRecipe.id, data: form },
			{
				onSuccess: () => {
					toast.success("Recipe updated!");
					setOpenEdit(false);
					setForm(defaultForm);
				},
				onError: () => toast.error("Failed to update recipe"),
			},
		);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this recipe?")) return;
		deleteRecipe.mutate(id, {
			onSuccess: () => toast.success("Recipe deleted!"),
			onError: () => toast.error("Failed to delete recipe"),
		});
	};

	const addIngredientRow = () => {
		setForm({
			...form,
			ingredients: [...form.ingredients, { ingredient_id: "", quantity: "" }],
		});
	};

	const removeIngredientRow = (index: number) => {
		setForm({
			...form,
			ingredients: form.ingredients.filter((_, i) => i !== index),
		});
	};

	const updateIngredientRow = (
		index: number,
		field: keyof IngredientInput,
		value: string,
	) => {
		const newIngredients = [...form.ingredients];
		newIngredients[index][field] = value;
		setForm({ ...form, ingredients: newIngredients });
	};

	const openEditDialog = (recipe: Recipe) => {
		setSelectedRecipe(recipe);
		setForm({
			name: recipe.name,
			instruction: recipe.instruction,
			ingredients:
				recipe.ingredientRecipes?.map((ir) => ({
					ingredient_id: ir.ingredient?.id || "",
					quantity: String(ir.quantity),
				})) || [],
		});
		setOpenEdit(true);
	};

	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + "...";
	};

	const RecipeForm = ({
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
				placeholder="Recipe Name"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
			/>
			<Textarea
				placeholder="Cooking Instructions"
				value={form.instruction}
				onChange={(e) => setForm({ ...form, instruction: e.target.value })}
				rows={4}
			/>
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">Ingredients</span>
					<Button type="button" size="sm" variant="outline" onClick={addIngredientRow}>
						+ Add
					</Button>
				</div>
				{form.ingredients.map((ing, index) => (
					<div key={index} className="flex gap-2">
						<select
							className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={ing.ingredient_id}
							onChange={(e) => updateIngredientRow(index, "ingredient_id", e.target.value)}
						>
							<option value="">Select Ingredient</option>
							{ingredients.map((ingredient) => (
								<option key={ingredient.id} value={ingredient.id}>
									{ingredient.name}
								</option>
							))}
						</select>
						<Input
							type="number"
							placeholder="Qty"
							value={ing.quantity}
							onChange={(e) => updateIngredientRow(index, "quantity", e.target.value)}
							className="w-24"
						/>
						<Button
							type="button"
							size="sm"
							variant="destructive"
							onClick={() => removeIngredientRow(index)}
						>
							&times;
						</Button>
					</div>
				))}
			</div>
			<Button onClick={onSubmit} disabled={isPending}>
				{isPending ? "Saving..." : submitLabel}
			</Button>
		</div>
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Recipes</h1>
				<Dialog open={openCreate} onOpenChange={setOpenCreate}>
					<DialogTrigger asChild>
						<Button>Add Recipe</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Recipe</DialogTitle>
						</DialogHeader>
						<RecipeForm
							onSubmit={handleCreate}
							submitLabel="Save"
							isPending={createRecipe.isPending}
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
							<TableHead>Instruction</TableHead>
							<TableHead>Ingredients</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recipes.map((recipe) => (
							<TableRow key={recipe.id}>
								<TableCell className="font-medium">{recipe.name}</TableCell>
								<TableCell>{truncateText(recipe.instruction, 50)}</TableCell>
								<TableCell>
									{recipe.ingredientRecipes?.length || 0} items
								</TableCell>
								<TableCell className="flex gap-2">
									<Dialog
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
									</Dialog>
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
