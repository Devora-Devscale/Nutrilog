"use client";

import {
	BookOpen,
	Bot,
	GalleryVerticalEnd,
	Settings2,
	SquareTerminal,
} from "lucide-react";
import type * as React from "react";

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
			title: "Meal Plan",
			url: "/",
			icon: SquareTerminal,
		},
		{
			title: "Recipe",
			url: "/recipe",
			icon: Bot,
		},
		{
			title: "Ingredient",
			url: "/ingredient",
			icon: BookOpen,
		},
		{
			title: "User Management",
			url: "/user-management",
			icon: Settings2,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
