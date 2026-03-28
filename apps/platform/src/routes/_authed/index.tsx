import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStats } from "@/modules/dashboard/useDashboard";

export const Route = createFileRoute("/_authed/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Home",
		},
	},
});

function RouteComponent() {
	const { data: stats, isLoading } = useGetDashboardStats();

	const cards = [
		{
			title: "Sekolah",
			value: stats?.schoolCount ?? 0,
		},
		{
			title: "Ingredient (Stock > 0)",
			value: stats?.ingredientInStock ?? 0,
		},
		{
			title: "Recipe",
			value: stats?.recipeCount ?? 0,
		},
		{
			title: "User",
			value: stats?.userCount ?? 0,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					{cards.map((card) => (
						<Card key={card.title}>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{card.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{card.value}</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
