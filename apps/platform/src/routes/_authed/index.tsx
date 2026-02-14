import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/")({
	component: App,
	staticData: {
		crumb: {
			module: "Home",
			module_path: "/",
		},
	},
});

function App() {
	return <div>This is a protected route</div>;
}
