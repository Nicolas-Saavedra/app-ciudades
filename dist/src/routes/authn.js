import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { registerUserSchema, loginResponseSchema, loginUserSchema, registerResponseSchema, refreshResponseSchema, refreshTokenSchema, } from "../schemas/authn.js";
import { zValidator } from "@hono/zod-validator";
import { createUser, getUserByEmail } from "../repositories/user.js";
import { EntityAlreadyExistsError, EntityNotFoundError, } from "../exceptions.js";
import { JwtTokenExpired, JwtTokenInvalid, JwtTokenSignatureMismatched, } from "hono/utils/jwt/types";
import { getHashFromString, signAccessToken, signRefreshToken, verifyRefreshToken, } from "../services/authn.js";
import { timingSafeEqual } from "crypto";
export const authn = new Hono();
authn.post("/register", describeRoute({
    description: "Registers a user into the system",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        secret: { type: "string" },
                    },
                    required: ["refresh_token"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Successful registration",
            content: {
                "text/json": { schema: resolver(registerResponseSchema) },
            },
        },
    },
}), zValidator("json", registerUserSchema), async (c) => {
    const user = c.req.valid("json");
    try {
        await createUser(user);
    }
    catch (err) {
        if (err instanceof EntityAlreadyExistsError) {
            c.status(403);
            return c.text("Could not process the request: A user with that name already exists, please try another name");
        }
        else {
            // Should throw some alarms
            console.log(err);
            c.status(500);
            return c.text("Could not process the request: An unexpected error ocurred in the server");
        }
    }
    return c.json({
        access_token: await signAccessToken(user.email),
        refresh_token: await signRefreshToken(user.email),
    });
});
authn.post("/login", describeRoute({
    description: "Logs in a user using JWT authentication",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        secret: { type: "string" },
                    },
                    required: ["refresh_token"],
                },
            },
        },
    },
    responses: {
        200: {
            description: "Successful login",
            content: {
                "text/json": { schema: resolver(loginResponseSchema) },
            },
        },
    },
}), zValidator("json", loginUserSchema), async (c) => {
    const possibleUser = c.req.valid("json");
    let foundUser;
    try {
        foundUser = await getUserByEmail(possibleUser.email);
    }
    catch (err) {
        if (err instanceof EntityNotFoundError) {
            c.status(404);
            return c.text("Could not process the request: Your username or password is incorrect");
        }
        else {
            // Should throw some alarms
            console.log(err);
            c.status(500);
            return c.text("Could not process the request: An unexpected error ocurred in the server");
        }
    }
    if (!timingSafeEqual(Buffer.from(foundUser.secret), Buffer.from(await getHashFromString(possibleUser.secret)))) {
        c.status(404);
        return c.text("Could not process the request: Your username or password is incorrect");
    }
    return c.json({
        access_token: await signAccessToken(foundUser.email),
        refresh_token: await signRefreshToken(foundUser.email),
    });
});
authn.post("/refresh", describeRoute({
    description: "Refreshes the access token of a user using the refresh token",
    parameters: [
        {
            name: "refresh_token",
            in: "cookie",
            required: true,
            schema: { type: "string" },
        },
    ],
    responses: {
        200: {
            description: "Successful token refresh",
            content: {
                "text/json": { schema: resolver(refreshResponseSchema) },
            },
        },
    },
}), 
// Using cookies here since HttpOnly should be used for refresh tokens
zValidator("cookie", refreshTokenSchema), async (c) => {
    const refreshToken = c.req.valid("cookie").refresh_token;
    let payload;
    try {
        payload = await verifyRefreshToken(refreshToken);
    }
    catch (err) {
        if (err instanceof JwtTokenInvalid ||
            err instanceof JwtTokenExpired ||
            err instanceof JwtTokenSignatureMismatched // TODO: could group these into a superclass
        ) {
            c.status(401);
            return c.text("Could not process the request: The JWT token is not valid");
        }
        else {
            // Should throw some alarms
            console.log(err);
            c.status(500);
            return c.text("Could not process the request: An unexpected error ocurred in the server");
        }
    }
    return c.json({
        access_token: await signAccessToken(payload.sub),
    });
});
// There is no logout route cause unless we wish to introduce tracking of logged out users,
// tokens cannot be manipulated or invalidated easily from the server without adding
// Session state of some kind on the server, which limits the usefulness of JWT tokens
