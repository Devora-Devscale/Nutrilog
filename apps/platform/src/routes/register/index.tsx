import { createFileRoute } from "@tanstack/react-router";

import { RegisterForm } from "@/components/register-form";
export const Route = createFileRoute("/register/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className=" h-screen flex justify-center items-center">
			<RegisterForm className=" w-10/12 md:w-4/12" />
		</div>
	);
}
