import { db } from "../db/index.js";
import { transactionsTable } from "../db/schema.js";
export const fetchTransactions = async (limit) => {
    const transactions = await db.select().from(transactionsTable).limit(limit);
    return transactions;
};
