import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/meal-plan/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Meal Plan",
		},
	},
});

function RouteComponent() {
	return <div>Hello "/_authed/meal-plan/"!</div>;
}
