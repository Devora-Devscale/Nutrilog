import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.url(),
	JWT_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const env = () => {
	try {
		return envSchema.parse(process.env) as Env;
	} catch {
		throw new Error("Env is not found");
	}
};
