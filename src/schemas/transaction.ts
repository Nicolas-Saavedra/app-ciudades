import { z } from "zod";

export const transactionSchema = z.object({
  transactionType: z.string().openapi({
    description:
      "The type of the transaction (e.g., withdrawal, invoice, payment)",
  }),
  transactionDescription: z.string().openapi({
    description: "A brief description of the transaction",
  }),
  amount: z.number().openapi({
    description: "The amount of money involved in the transaction",
  }),
  currencyCode: z.string().openapi({
    description: "The ISO 4217 currency code (e.g., USD, EUR, JPY)",
  }),
  id: z.string().uuid().openapi({
    description: "A UUID that uniquely identifies the transaction",
  }),
});

export const transactionQueryResponseSchema = z.array(transactionSchema);
