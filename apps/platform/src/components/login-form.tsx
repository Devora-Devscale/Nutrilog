import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoginForm, useLoginMutation } from "@/routes/login/-hook";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useLoginForm();
	const { mutateAsync, isPending } = useLoginMutation();
	const handleLogin = handleSubmit(async (data) => {
		await mutateAsync(data);
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									{...register("email")}
								/>
								{errors.email?.message && (
									<FieldError>{errors.email?.message}</FieldError>
								)}
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<a
										href="/"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<Input
									id="password"
									type="password"
									required
									{...register("password")}
								/>
								{errors.password?.message && (
									<FieldError>{errors.password?.message}</FieldError>
								)}
							</Field>
							<Field>
								<Button disabled={isPending} type="submit">
									{isPending ? "Logging in..." : "Login"}
								</Button>
								<Button disabled variant="outline" type="button">
									Login with Google
								</Button>
								<FieldDescription className="text-center">
									Don&apos;t have an account?{" "}
									<Link to="/register">Sign up</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
