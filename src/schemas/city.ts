import { z } from "zod";

export const citySchema = z.object({
  city: z.string().openapi({
    description: "The name of the city",
  }),
  latitude: z.number().openapi({
    description: "Latitude of the city",
  }),
  longitude: z.number().openapi({
    description: "Longitude of the city",
  }),
});
