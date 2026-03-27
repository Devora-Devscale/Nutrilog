import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/ingredient/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Ingredient",
		},
	},
});

function RouteComponent() {
	return <div>Hello "/_authed/ingredients/"!</div>;
}
