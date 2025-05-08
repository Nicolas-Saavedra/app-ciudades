import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { transactionQueryResponseSchema } from "../schemas/transaction.js";
import { resolver } from "hono-openapi/zod";
import { fetchTransactions } from "../services/transaction.js";

export const transactions = new Hono();

transactions.get(
  "/",
  describeRoute({
    description: "Views transaction history",
    responses: {
      200: {
        description: "Successful login",
        content: {
          "text/json": { schema: resolver(transactionQueryResponseSchema) },
        },
      },
    },
  }),
  async (c) => {
    return c.json(await fetchTransactions(10));
  },
);
