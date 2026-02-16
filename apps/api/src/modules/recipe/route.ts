import { zValidator } from "@hono/zod-validator";
import { createRecipeSchema, updateRecipeSchema } from "@nutrilog/schema";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
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
	});
