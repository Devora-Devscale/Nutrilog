import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className=" h-screen flex justify-center items-center">
			<LoginForm className=" w-10/12 md:w-4/12" />
		</div>
	);
}
