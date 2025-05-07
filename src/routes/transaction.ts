import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { transactionQueryResponseSchema } from "../schemas/transaction.js";
import { resolver } from "hono-openapi/zod";

export const transactions = new Hono();

transactions.get(
  "/",
  describeRoute({
    description: "Searches for restaurants based on city",
    responses: {
      200: {
        description: "Successful login",
        content: {
          "text/json": { schema: resolver(transactionQueryResponseSchema) },
        },
      },
    },
  }),
  (c) => {},
);
