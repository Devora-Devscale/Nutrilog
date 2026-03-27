import z from "zod";

export const createSchoolSchema = z.object({
	name: z.string().min(1, "Name is required"),
	address: z.string().min(1, "Address is required"),
});

export const updateSchoolSchema = createSchoolSchema.partial();

export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
