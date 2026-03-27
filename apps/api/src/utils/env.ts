import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.url(),
	JWT_SECRET: z.string().min(1),
	GEMINI_API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = () => {
	try {
		return envSchema.parse(process.env) as Env;
	} catch (err) {
		console.log(err);
		throw new Error("Env is not found");
	}
};
