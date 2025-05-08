import { index } from "drizzle-orm/gel-core";
import { doublePrecision, geometry, numeric, pgTable, uuid, varchar, } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    email: varchar({ length: 64 }).notNull().unique(),
    secret: varchar({ length: 128 }).notNull().unique(),
});
export const transactionsTable = pgTable("transactions", {
    id: uuid("id").primaryKey().notNull(),
    transactionType: varchar("transaction_type", { length: 32 }).notNull(),
    transactionDescription: varchar("transaction_description", {
        length: 255,
    }).notNull(),
    amount: numeric("amount").notNull(),
    currencyCode: varchar("currency_code", { length: 3 }).notNull(), // ISO 4217 codes are 3 characters
});
export const restaurantsTable = pgTable("restaurants", {
    id: varchar("id", { length: 127 }).primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    streetAddress: varchar("street_address", { length: 255 }).notNull(),
    city: varchar("city", { length: 127 }).notNull(),
    country: varchar("country", { length: 127 }).notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    point: geometry("point", { type: "point" }),
});
export const citiesTable = pgTable("cities", {
    city: varchar("city", { length: 127 }).primaryKey().notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    point: geometry("point", { type: "point" }),
});
