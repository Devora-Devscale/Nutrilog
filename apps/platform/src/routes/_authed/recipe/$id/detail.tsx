import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_authed/recipe/$id/detail")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Recipe",
			module_path: "/recipe",
			action: "Detail",
		},
	},
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { data: { recipe } = {} } = useQuery({
		queryKey: ["recipe", id],
		queryFn: async () => {
			const res = await api.recipes[":id"].$get({
				param: { id },
			});
			return await res.json();
		},
	});

	return (
		<div className=" ms-6 space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">{recipe?.name}</h2>
				<Link to="/recipe">
					<Button>Back</Button>
				</Link>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Ingredients</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className=" mb-2">
						{recipe?.ingredientRecipes?.map((ir) => (
							<li key={ir.id} className="flex justify-between">
								<span>{ir.ingredient.name}</span>
								<span className="text-muted-foreground">
									{ir.quantity} {ir.ingredient.unit?.name}
								</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Instruction</CardTitle>
				</CardHeader>
				<CardContent>
					<Textarea disabled value={recipe?.instruction} className="h-100" />
				</CardContent>
			</Card>
		</div>
	);
}
