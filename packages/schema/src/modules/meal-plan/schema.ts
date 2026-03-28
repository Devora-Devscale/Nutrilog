import z from "zod";

export const createMealPlanSchema = z.object({
	date: z.iso.datetime(),
	received_time: z.iso.datetime().optional(),
	status: z.enum(["RECEIVED", "SEND", "PENDING"]),
	portion: z.number(),
	receipt_photo: z.string(),
	school_id: z.uuid(),
	recipe_id: z.uuid(),
	receiver_id: z.uuid().optional(),
	sender_id: z.uuid().optional(),
});
export const createMealPlansSchema = z.array(createMealPlanSchema);

export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>;
export type CreateMealPlansInput = z.infer<typeof createMealPlansSchema>;

export const updateMealPlanSchema = createMealPlanSchema.extend({
	id: z.uuid(),
});
export const updateMealPlansSchema = z.array(
	updateMealPlanSchema.partial({
		id: true,
	}),
);

export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>;
export type UpdateMealPlansInput = z.infer<typeof updateMealPlansSchema>;
