import { bearerAuth } from "hono/bearer-auth";
import { verify } from "hono/jwt";
import {
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
} from "hono/utils/jwt/types";

const JWT_SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY;

export const authnMiddleware = bearerAuth({
  async verifyToken(token, c) {
    try {
      await verify(token, JWT_SECRET_ACCESS_KEY!);
    } catch (err) {
      if (
        err instanceof JwtTokenExpired ||
        err instanceof JwtTokenInvalid ||
        err instanceof JwtTokenIssuedAt
      ) {
        return false;
      } else {
        console.log("middlewares/authn.ts:24", err);
        return false;
      }
    }
    return true;
  },
  invalidAuthenticationHeaderMessage:
    "You must be authenticated to perform this action",
  noAuthenticationHeaderMessage:
    "You must be authenticated to perform this action",
  invalidTokenMessage: "The token supplied is not valid",
});
