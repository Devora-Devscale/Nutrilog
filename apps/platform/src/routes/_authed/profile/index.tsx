import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/profile/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Profile",
		},
	},
});

function RouteComponent() {
	return <div>Hello "/_authed/profile/"!</div>;
}
