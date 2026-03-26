import z from "zod";

export const updateUserSchema = z.object({
	name: z.string().min(1).optional(),
	role: z
		.enum([
			"KITCHEN_STAFF",
			"WAREHOUSE_MANAGER",
			"SCHOOL_ADMIN",
			"VENDOR_MANAGER",
			"AUDITOR",
		])
		.optional(),
	school_id: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
