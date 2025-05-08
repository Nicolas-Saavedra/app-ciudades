import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import {
  restaurantSearchResponseSchema,
  restaurantSearchSchema,
  type Coordinates,
} from "../schemas/restaurant.js";
import { fetchCoordinates, fetchRestaurants } from "../services/restaurant.js";
import { EntityNotFoundError } from "../exceptions.js";

export const restaurants = new Hono();

restaurants.post(
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
  async (c) => {
    const query = c.req.valid("json");

    let coordinates: Coordinates;

    if (query.city === undefined) {
      coordinates = query.coordinates!;
    } else {
      try {
        coordinates = await fetchCoordinates(query.city);
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          c.status(403);
          return c.text(
            "Could not process the request: A city with that name does not exist in our database, please try another name",
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
    }

    return c.json(await fetchRestaurants(coordinates, 10));
  },
);
