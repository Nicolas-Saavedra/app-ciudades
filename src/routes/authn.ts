import { Hono } from "hono";

export const authn = new Hono();

authn.get("/login", (c) => {});

authn.get("/register", (c) => {});
