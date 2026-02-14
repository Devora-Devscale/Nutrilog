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
import { useRegisterForm, useRegisterMutation } from "@/routes/register/-hooks";

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useRegisterForm();
	const { mutateAsync } = useRegisterMutation();

	const handleRegister = handleSubmit(async (data) => {
		await mutateAsync(data);
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Create Account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleRegister}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									{...register("email")}
									id="email"
									type="email"
									placeholder="m@example.com"
									required
								/>
								{errors.email?.message && (
									<FieldError>{errors.email?.message}</FieldError>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
								<Input
									{...register("name")}
									id="name"
									type="name"
									placeholder="your name here"
									required
								/>
								{errors.name?.message && (
									<FieldError>{errors.name?.message}</FieldError>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input
									{...register("password")}
									id="password"
									type="password"
									required
								/>
								{errors.password?.message && (
									<FieldError>{errors.password?.message}</FieldError>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm_password">
									Confirm Password
								</FieldLabel>
								<Input
									{...register("confirm_password")}
									id="confirm_password"
									type="password"
									required
								/>
								{errors.confirm_password?.message && (
									<FieldError>{errors.confirm_password?.message}</FieldError>
								)}
							</Field>
							<Field>
								<Button type="submit">Create Account</Button>
								<FieldDescription className="text-center">
									Already have an account? <Link to="/login">Login</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
