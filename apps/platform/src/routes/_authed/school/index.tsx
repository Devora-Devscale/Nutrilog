import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/school/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "School",
		},
	},
});

function RouteComponent() {
	return <div>Hello "/_authed/school/"!</div>;
}
