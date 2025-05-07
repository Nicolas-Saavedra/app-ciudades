import { pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  email: varchar({ length: 127 }).notNull().unique(),
  secret: varchar({ length: 127 }).notNull().unique(),
});
