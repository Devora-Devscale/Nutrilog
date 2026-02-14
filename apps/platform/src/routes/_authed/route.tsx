import {
	createFileRoute,
	Link,
	Outlet,
	useMatches,
} from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
});

function RouteComponent() {
	const matches = useMatches();
	const breadCrumbs = matches
		.filter((match) => match.staticData.crumb)
		.map((match) => ({
			path: match.fullPath,
			crumb: match.staticData.crumb,
		}));

	const path = breadCrumbs[0].crumb?.module_path
		? breadCrumbs[0].crumb?.module_path
		: breadCrumbs[0].path.replace(/\/$/, "") || "/";

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<Link
										to={path}
										className=" hover:text-foreground transition-colors"
									>
										{breadCrumbs[0].crumb?.module}
									</Link>
								</BreadcrumbItem>
								{breadCrumbs.map((crumb, index) => {
									// Cek apakah ini item terakhir (Halaman Aktif)
									const isLast = index === breadCrumbs.length - 1;
									return (
										<Fragment key={crumb.path}>
											{crumb.crumb?.action && (
												<BreadcrumbSeparator className="hidden md:block" />
											)}
											<BreadcrumbItem className="hidden md:block">
												{isLast ? (
													<BreadcrumbPage>{crumb.crumb?.action}</BreadcrumbPage>
												) : (
													<BreadcrumbLink asChild>
														<Link
															to={crumb.path.replace(/\/$/, "") || "/"}
															className="hover:text-foreground transition-colors"
														>
															{crumb.crumb?.action}
														</Link>
													</BreadcrumbLink>
												)}
											</BreadcrumbItem>

											{!isLast && (
												<BreadcrumbSeparator className="hidden md:block" />
											)}
										</Fragment>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
