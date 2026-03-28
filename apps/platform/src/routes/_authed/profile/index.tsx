import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/utils/api";

export const Route = createFileRoute("/_authed/profile/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Profile",
		},
	},
});

function RouteComponent() {
	const { data: user, isLoading } = useQuery({
		queryKey: ["profile-me"],
		queryFn: async () => {
			const response = await api.profile.me.$get();
			const data = await response.json();
			return data.user;
		},
	});

	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<h1 className="text-3xl font-bold">Profile</h1>
				<p className="text-muted-foreground">Manage your account settings</p>
			</div>

			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
					<CardDescription>View your profile details</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
					{isLoading ? (
						<Skeleton className="size-24 rounded-full" />
					) : (
						<Avatar className="size-24 rounded-full">
							<AvatarImage src={user?.avatar} alt={user?.name} />
							<AvatarFallback className="text-2xl">
								{user?.name?.charAt(0).toUpperCase() ?? "U"}
							</AvatarFallback>
						</Avatar>
					)}

					<div className="flex flex-1 flex-col gap-4 w-full">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-full bg-muted">
								<User className="size-5 text-muted-foreground" />
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-sm text-muted-foreground">Name</span>
								{isLoading ? (
									<Skeleton className="h-5 w-32" />
								) : (
									<span className="font-medium">{user?.name}</span>
								)}
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-full bg-muted">
								<Mail className="size-5 text-muted-foreground" />
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-sm text-muted-foreground">Email</span>
								{isLoading ? (
									<Skeleton className="h-5 w-48" />
								) : (
									<span className="font-medium">{user?.email}</span>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
