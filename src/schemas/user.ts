import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string(),
  secret: z.string(),
});
