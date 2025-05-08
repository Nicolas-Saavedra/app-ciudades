import { z } from "zod";

import "zod-openapi/extend";

export const restaurantSearchSchema = z
  .object({
    city: z
      .string()
      .optional()
      .openapi({ description: "City in which to search restaurants" }),
    coordinates: z
      .object({
        // Regex extracted from https://github.com/colinhacks/zod/issues/2600
        // Really wish Zod had this by default
        latitude: z
          .string()
          .regex(
            /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
          ),
        longitude: z
          .string()
          .regex(
            /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
          ),
      })
      .optional()
      .openapi({ description: "Coordinates to search restaurants in" }),
  })
  .refine(
    (data) => {
      // Forcing client here to XOR the fields of the request
      if (data.city === undefined) {
        return data.coordinates !== undefined;
      }
      if (data.coordinates === undefined) {
        return data.city !== undefined;
      }
      return data.city !== undefined && data.coordinates !== undefined;
    },
    {
      message: "You must specify either city or coordinates",
    },
  );

export const restaurantSchema = z.object({
  streetAddress: z.string().openapi({
    description: "Street address of the restaurant",
  }),
  city: z.string().openapi({
    description: "City where the restaurant is located",
  }),
  country: z.string().openapi({
    description: "Country where the restaurant is located",
  }),
  latitude: z.number().openapi({
    description: "Latitude coordinate of the restaurant",
  }),
  longitude: z.number().openapi({
    description: "Longitude coordinate of the restaurant",
  }),
  name: z.string().openapi({
    description: "Name of the restaurant",
  }),
  id: z.string().openapi({
    description: "ID of the restaurant",
  }),
});

export const restaurantSearchResponseSchema = z.array(restaurantSchema);

export type Restaurant = z.infer<typeof restaurantSchema>;
