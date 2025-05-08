import { z } from "zod";

import "zod-openapi/extend";

export const userSchema = z.object({
  email: z.string().openapi({ description: "Email of the user" }),
  secret: z.string().openapi({ description: "Secret of the user" }),
});

export const jwtTokenSchema = z.object({
  access_token: z.string().openapi({ description: "JWT access token" }),
  refresh_token: z.string().openapi({ description: "JWT refresh token" }),
});

export const registerUserSchema = userSchema;
export const loginUserSchema = userSchema;
export const refreshTokenSchema = jwtTokenSchema.pick({ refresh_token: true });

export const loginResponseSchema = jwtTokenSchema;
export const registerResponseSchema = jwtTokenSchema;
export const refreshResponseSchema = jwtTokenSchema.pick({
  access_token: true,
});

export type User = z.infer<typeof userSchema>;
