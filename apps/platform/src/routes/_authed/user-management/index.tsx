import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/user-management/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "User Management",
		},
	},
});

function RouteComponent() {
	return <div>Hello "/_authed/user-management/"!</div>;
}
