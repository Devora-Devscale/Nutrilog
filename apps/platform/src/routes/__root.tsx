import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
<<<<<<< HEAD
import tanstackQueryConfig from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

=======
import { NotFound } from "@/components/not-found";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import tanstackQueryConfig from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		crumb?: { module: string; action?: string; module_path?: string };
	}
}

>>>>>>> group/main
interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
<<<<<<< HEAD
				title: "TanStack Start Starter",
=======
				title: "Nutrilog by Devora Devscale",
>>>>>>> group/main
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
<<<<<<< HEAD
=======
	notFoundComponent: NotFound,
>>>>>>> group/main
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
<<<<<<< HEAD
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						tanstackQueryConfig,
					]}
				/>
				<Scripts />
=======
				<TooltipProvider>
					{children}
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							tanstackQueryConfig,
						]}
					/>
					<Toaster position="top-center" />
					<Scripts />
				</TooltipProvider>
>>>>>>> group/main
			</body>
		</html>
	);
}
