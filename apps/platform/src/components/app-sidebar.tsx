"use client";

import { useAtomValue } from "jotai";
import {
	BookOpen,
	Bot,
	GalleryVerticalEnd,
	Settings2,
	SquareTerminal,
} from "lucide-react";
import type * as React from "react";
import { userAtom } from "@/atoms/user.atom";
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
			name: "NutriLog",
			logo: GalleryVerticalEnd,
			plan: "by Devora",
		},
	],
	navMain: [
		{
			title: "Playground",
			url: "#",
			icon: SquareTerminal,
			isActive: false,
		},
		{
			title: "Models",
			url: "#",
			icon: Bot,
		},
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const user = useAtomValue(userAtom);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
