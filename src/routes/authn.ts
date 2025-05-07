import { Hono } from "hono";

export const auth = new Hono();

auth.get("/login", (c) => {});

auth.get("/register", (c) => {});
