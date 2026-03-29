import { zValidator } from "@hono/zod-validator";
import {
	createRecipeSchema,
	generateInstruction,
	updateRecipeSchema,
} from "@nutrilog/schema";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { prisma } from "../../utils/prisma.js";
import { generateRecipeInstruction } from "./ai.js";
import {
	createRecipe,
	deleteRecipes,
	getRecipes,
	updateRecipes,
} from "./service.js";

export const recipeRoute = new Hono()
	.post("/", zValidator("json", createRecipeSchema), async (c) => {
		const data = c.req.valid("json");
		try {
			const recipe = await createRecipe(data);
			return c.json({ success: true, data: recipe }, 201);
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to create recipe" });
		}
	})
	.post("/instruction", zValidator("json", generateInstruction), async (c) => {
		const { name } = c.req.valid("json");
		try {
			console.log("=== GENERATE INSTRUCTION REQUEST ===");
			console.log("Recipe name:", name);
			const instruction = await generateRecipeInstruction(name);
			console.log("=== GENERATE SUCCESS ===");
			return c.json({ success: true, data: { instruction } });
		} catch (error) {
			console.error("=== GENERATE ERROR ===");
			console.error(error);
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new HTTPException(500, {
				message:
					error instanceof Error
						? error.message
						: "Failed to generate instruction",
			});
		}
	})
	.get("/", async (c) => {
		try {
			const recipes = await getRecipes();
			return c.json({ success: true, data: recipes });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to fetch recipes" });
		}
	})
	.put("/:id", zValidator("json", updateRecipeSchema), async (c) => {
		const id = c.req.param("id");
		const data = c.req.valid("json");
		try {
			const recipe = await updateRecipes(id, data);
			return c.json({ success: true, data: recipe });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to update recipe" });
		}
	})
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		try {
			const result = await deleteRecipes(id);
			return c.json({ success: true, data: result });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to delete recipe" });
		}
	})
	.get("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
		const { id } = c.req.valid("param");
		const recipe = await prisma.recipe.findFirst({
			where: { id },
			include: {
				ingredientRecipes: {
					include: {
						ingredient: {
							include: { unit: true },
						},
					},
				},
			},
		});
		return c.json({ recipe });
	});
