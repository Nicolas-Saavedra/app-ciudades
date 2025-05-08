import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { citiesTable, restaurantsTable } from "../db/schema.js";
import type { Coordinates, RestaurantResponse } from "../schemas/restaurant.js";
import { EntityNotFoundError } from "../exceptions.js";

export const fetchRestaurants = async (
  coordinates: Coordinates,
  limit: number,
) => {
  // Drizzle ORM avoids SQL Injections here with `sql`
  const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${coordinates.longitude}, ${coordinates.latitude}), 4326)`;

  const results = await db
    .select({
      ...getTableColumns(restaurantsTable),
      distance: sql`ST_Distance(${restaurantsTable.point}, ${sqlPoint})`,
    })
    .from(restaurantsTable)
    .orderBy(sql`${restaurantsTable.point} <-> ${sqlPoint}`)
    .limit(limit);

  return results.map((result) => {
    const { point, ...rest } = result; // Removing point cause it's reduntant
    return rest;
  }) as RestaurantResponse;
};

export const fetchCoordinates = async (city: string) => {
  const cities = await db
    .select()
    .from(citiesTable)
    .where(eq(citiesTable.city, city)); // TODO: Caps-lock ignore

  if (cities.length === 0) {
    throw new EntityNotFoundError(`Could not find city with name ${city}`);
  }

  return cities[0];
};
