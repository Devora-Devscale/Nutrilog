import z from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({
	name: z.string(),
});

export const registerFESchema = registerSchema
	.extend({
		confirm_password: z.string(),
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ["confirm_password"],
		error: "Password and Confirm Password doesn't match",
	});
