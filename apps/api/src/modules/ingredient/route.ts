import { Hono } from "hono";
import { getIngredients } from "./service.js";

export const ingredientRoute = new Hono().get("/", async (c) => {
	const ingredients = await getIngredients();
	return c.json({ ingredients });
});
