import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authn } from "./routes/authn.js";
import { restaurant } from "./routes/restaurant.js";

const app = new Hono();

app.get("/health", (c) => {
  return c.text("OK");
});

app.route("/auth", authn);
app.route("/restaurant", restaurant);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
