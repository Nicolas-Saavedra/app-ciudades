import { z } from "zod";

import "zod-openapi/extend";

const EXAMPLE_JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiZXhwIjoxNzQ2Njc1NzQwfQ.2_IyVFovBmM-MZfxZjPq8q2ikDYpRODev0Q8cqbD7EM";

export const userSchema = z.object({
  email: z.string().email().openapi({
    description: "Email of the user",
    example: "example@example.com",
  }),
  secret: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .openapi({ description: "Secret of the user", example: "########" }),
});

export const jwtTokenSchema = z.object({
  access_token: z
    .string()
    .max(256)
    .openapi({ description: "JWT access token", example: EXAMPLE_JWT_TOKEN }),
  refresh_token: z
    .string()
    .max(256)
    .openapi({ description: "JWT refresh token", example: EXAMPLE_JWT_TOKEN }),
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
