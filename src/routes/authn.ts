import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import {
  registerUserSchema,
  loginResponseSchema,
  loginUserSchema,
  registerResponseSchema,
} from "../schemas/user.js";
import { zValidator } from "@hono/zod-validator";

export const authn = new Hono();

authn.post(
  "/register",
  describeRoute({
    description: "Registers a user into the system",
    responses: {
      200: {
        description: "Successful registration",
        content: {
          "text/json": { schema: resolver(registerResponseSchema) },
        },
      },
    },
  }),
  zValidator("json", registerUserSchema),
  (c) => {
    const query = c.req.valid("json");
    return c.text("Successful validation");
  },
);

authn.post(
  "/login",
  describeRoute({
    description: "Logs in a user using JWT authentication",
    responses: {
      200: {
        description: "Successful login",
        content: {
          "text/json": { schema: resolver(loginResponseSchema) },
        },
      },
    },
  }),
  zValidator("json", loginUserSchema),
  (c) => {
    const query = c.req.valid("json");
    return c.text("Successful validation");
  },
);
