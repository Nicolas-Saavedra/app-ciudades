import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { EntityAlreadyExistsError, EntityNotFoundError, } from "../exceptions.js";
import { getHashFromString } from "../services/authn.js";
export const createUser = async (user) => {
    const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, user.email));
    if (result.length > 0) {
        throw new EntityAlreadyExistsError("User already exists");
    }
    user.secret = await getHashFromString(user.secret);
    db.insert(usersTable).values(user).execute();
};
export const getUserByEmail = async (email) => {
    const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    if (result.length < 1) {
        throw new EntityNotFoundError("User could not be found in the database");
    }
    return result[0];
};
