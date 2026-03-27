import { Hono } from "hono";
import type { HonoContext } from "../../types.js";
import { getUser } from "./service.js";

export const profileRoute = new Hono<HonoContext>().get("/me", async (c) => {
	const userContext = c.get("user");
	const user = getUser(userContext.id);
	return c.json({ user });
});
