import { z } from "zod";

export const createUnitSchema = z.object({
	name: z.string(),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;

export const updateUnitSchema = createUnitSchema.extend({
	id: z.uuid(),
	name: z.string(),
});

export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
