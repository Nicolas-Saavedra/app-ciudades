import { restaurantsTable } from "../db/schema.js";
import type { Coordinates } from "../schemas/restaurant.js";

export const fetchRestaurants = async (coordinates: Coordinates) => {
  const result = await db
    .select()
    .from(restaurantsTable)
    .where(eq(usersTable.email, user.email));

  if (result.length > 0) {
    throw new EntityAlreadyExistsError("User already exists");
  }

  user.secret = await getHashFromString(user.secret);
  db.insert(usersTable).values(user).execute();
};
