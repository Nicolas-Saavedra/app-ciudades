import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import {
  restaurantSearchResponseSchema,
  restaurantSearchSchema,
} from "../schemas/restaurant.js";

export const restaurant = new Hono();

restaurant.post(
  "/search",
  describeRoute({
    description: "Searches for restaurants based on city",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              city: { type: "string" },
              coordinates: {
                type: "object",
                properties: {
                  latitude: { type: "number" },
                  longitude: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successful login",
        content: {
          "text/json": { schema: resolver(restaurantSearchResponseSchema) },
        },
      },
    },
  }),
  zValidator("json", restaurantSearchSchema),
  (c) => {
    const query = c.req.valid("json");
  },
);
