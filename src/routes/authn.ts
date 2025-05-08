import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import {
  registerUserSchema,
  loginResponseSchema,
  loginUserSchema,
  registerResponseSchema,
  type User,
} from "../schemas/user.js";
import { zValidator } from "@hono/zod-validator";
import { createUser, getUserByEmail } from "../services/user.js";
import {
  EntityAlreadyExistsError,
  EntityNotFoundError,
} from "../exceptions.js";
import { sign } from "hono/jwt";

const JWT_SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY;
const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;

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
  async (c) => {
    const user = c.req.valid("json");

    try {
      await createUser(user);
    } catch (err) {
      if (err instanceof EntityAlreadyExistsError) {
        c.status(403);
        return c.text(
          "Could not process the request: A user with that name already exists, please try another name",
        );
      } else {
        // Should throw some alarms
        console.log(err);
        c.status(500);
        return c.text(
          "Could not process the request: An unexpected error ocurred in the server",
        );
      }
    }

    return {
      access_token: sign(
        {
          sub: user.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes
        },
        JWT_SECRET_ACCESS_KEY!,
      ),
      refresh_token: sign(
        {
          sub: user.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
        },
        JWT_SECRET_REFRESH_KEY!,
      ),
    };
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
  async (c) => {
    const possibleUser = c.req.valid("json");

    let foundUser: User;

    try {
      foundUser = await getUserByEmail(possibleUser.email);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        c.status(404);
        return c.text(
          "Could not process the request: Your username or password is incorrect",
        );
      } else {
        // Should throw some alarms
        console.log(err);
        c.status(500);
        return c.text(
          "Could not process the request: An unexpected error ocurred in the server",
        );
      }
    }

    if (foundUser.secret !== possibleUser.secret) {
      // Better to be not very descriptive when dealing with login
      c.status(404);
      return c.text(
        "Could not process the request: Your username or password is incorrect",
      );
    }

    return {
      access_token: sign(
        {
          sub: foundUser.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes
        },
        JWT_SECRET_ACCESS_KEY!,
      ),
      refresh_token: sign(
        {
          sub: foundUser.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
        },
        JWT_SECRET_REFRESH_KEY!,
      ),
    };
  },
);
