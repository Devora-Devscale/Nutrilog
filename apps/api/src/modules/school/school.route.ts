import { Hono } from "hono";
import { schoolService } from "./school.service";

export const schoolRoute = new Hono()
  .get("/", async (c) => {
    const data = await schoolService.getAll();
    return c.json(data);
  })
  .post("/", async (c) => {
    const body = await c.req.json();
    const data = await schoolService.create(body);
    return c.json(data);
  });