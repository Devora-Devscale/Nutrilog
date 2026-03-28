import { zValidator } from "@hono/zod-validator";
import {
	createMealPlansSchema,
	updateMealPlanSchema,
} from "@nutrilog/schema/dist/modules/meal-plan/schema.js";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "../../utils/prisma.js";

export const mealPlanRoute = new Hono()
	.get("/", async (c) => {
		const mealPlans = await prisma.mealPlan.findMany({
			include: {
				school: true,
				recipe: true,
			},
		});
		return c.json({ meal_plans: mealPlans });
	})
	.post("/", zValidator("json", createMealPlansSchema), async (c) => {
		const mealPlanRequests = c.req.valid("json");

		const mealPlans = mealPlanRequests.map(async (mealPlan) => {
			if (mealPlan.portion > 0) {
				return await prisma.mealPlan.create({
					data: mealPlan,
				});
			}
		});

		return c.json({ mealPlans });
	})
	.patch(
		"/:id",
		zValidator("param", z.object({ id: z.uuid() })),
		zValidator("json", updateMealPlanSchema),
		async (c) => {
			const data = c.req.valid("json");
			const { id } = c.req.valid("param");
			const mealPlan = await prisma.mealPlan.update({
				where: {
					id,
				},
				data,
			});
			return c.json({ mealPlan });
		},
	)
	.get("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
		const { id } = c.req.valid("param");
		const mealPlan = await prisma.mealPlan.findFirst({ where: { id } });
		return c.json({ mealPlan });
	})
	.delete(
		"/:id",
		zValidator("param", z.object({ id: z.uuid() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const mealPlan = await prisma.mealPlan.delete({
				where: {
					id,
				},
			});
			return c.json({ mealPlan });
		},
	);
