"use client";

import { useQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import {
	Beef,
	Boxes,
	Carrot,
	ContactRound,
	GalleryVerticalEnd,
	LayoutDashboard,
	Salad,
	School,
	ShoppingBasket,
} from "lucide-react";
import type * as React from "react";
import { toast } from "sonner";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { api } from "@/utils/api";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Nutrilog",
			logo: GalleryVerticalEnd,
			plan: "Devora Devscale",
		},
	],
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: LayoutDashboard,
		},
		{
			title: "Meal Plan",
			url: "/meal-plan",
			icon: Beef,
		},
		{
			title: "Recipe",
			url: "/recipe",
			icon: Salad,
		},
		{
			title: "Stocks",
			url: "/ingredient-transaction",
			icon: ShoppingBasket,
		},
		{
			title: "Ingredient",
			url: "/ingredient",
			icon: Carrot,
		},
		{
			title: "Unit",
			url: "/unit",
			icon: Boxes,
		},
		{
			title: "School",
			url: "/school",
			icon: School,
		},
		{
			title: "User Management",
			url: "/user",
			icon: ContactRound,
		},
	],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: user } = useQuery({
		queryKey: ["profile-me"],
		queryFn: async () => {
			try {
				const response = await api.profile.me.$get();
				const data = await response.json();
				return data.user;
			} catch (_error) {
				toast.error("Authentication failed. Redirecting..");
				throw redirect({ to: "/login" });
			}
		},
		retry: false,
	});

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				{/** biome-ignore lint/style/noNonNullAssertion: i'll fix this later */}
				<NavUser user={{ avatar: "", ...user! }} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
