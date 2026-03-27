import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/recipe/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Recipe",
		},
	},
});

function RouteComponent() {
	return <div>Hello "/_authed/recipe/"!</div>;
}
