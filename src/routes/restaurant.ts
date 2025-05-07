import { Hono } from "hono";

export const restaurant = new Hono();

restaurant.post("/search", (c) => {});

restaurant.get("/history", (c) => {});
