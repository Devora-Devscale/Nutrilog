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
import { useRegisterForm, useRegisterMutation } from "@/routes/register/-hook";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useRegisterForm();
	const { isPending, mutateAsync } = useRegisterMutation();

	const handleRegister = handleSubmit(async (data) => {
		await mutateAsync(data);
	});
	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleRegister}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Full Name</FieldLabel>
							<Input {...register("name")} id="name" placeholder="John Doe" />
							{errors.name?.message && (
								<FieldError>{errors.name?.message}</FieldError>
							)}
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								{...register("email")}
								id="email"
								placeholder="m@example.com"
							/>
							<FieldDescription>
								We&apos;ll use this to contact you. We will not share your email
								with anyone else.
							</FieldDescription>
							{errors.email?.message && (
								<FieldError>{errors.email?.message}</FieldError>
							)}
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input {...register("password")} id="password" type="password" />
							<FieldDescription>
								Must be at least 8 characters long.
							</FieldDescription>
							{errors.password?.message && (
								<FieldError>{errors.password?.message}</FieldError>
							)}
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm_password">
								Confirm Password
							</FieldLabel>
							<Input
								id="confirm_password"
								{...register("confirm_password")}
								type="password"
							/>
							<FieldDescription>Please confirm your password.</FieldDescription>
							{errors.confirm_password?.message && (
								<FieldError>{errors.confirm_password?.message}</FieldError>
							)}
						</Field>
						<FieldGroup>
							<Field>
								<Button disabled={isPending} type="submit">
									{isPending ? "Creating account..." : "Create Account"}
								</Button>
								<Button disabled variant="outline" type="button">
									Sign up with Google
								</Button>
								<FieldDescription className="px-6 text-center">
									Already have an account? <Link to="/login">Sign in</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
