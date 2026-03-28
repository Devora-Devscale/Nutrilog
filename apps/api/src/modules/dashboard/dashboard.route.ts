import { Hono } from "hono";
import { prisma } from "../../utils/prisma.js";

export const dashboardRoute = new Hono().get("/", async (c) => {
	try {
		const [schoolCount, userCount, recipeCount, ingredientInStock] =
			await Promise.all([
				prisma.school.count(),
				prisma.user.count(),
				prisma.recipe.count(),
				prisma.ingredient.count({
					where: {
						stock: {
							gt: 0,
						},
					},
				}),
			]);

		return c.json({
			success: true,
			data: {
				schoolCount,
				userCount,
				recipeCount,
				ingredientInStock,
			},
		});
	} catch (error) {
		console.error(error);
		return c.json(
			{ success: false, message: "Failed to fetch dashboard data" },
			400,
		);
	}
});
