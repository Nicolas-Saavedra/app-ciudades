import { Hono } from "hono";
import { authn } from "./routes/authn.js";
import { restaurants } from "./routes/restaurant.js";
import { openAPISpecs } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { transactions } from "./routes/transaction.js";
export const app = new Hono();
app.get("/health", (c) => {
    return c.text("OK");
});
app.route("/auth", authn);
app.route("/restaurants", restaurants);
app.route("/transactions", transactions);
app.get("/docs", Scalar({ url: "/openapi" }));
app.get("/openapi", openAPISpecs(app, {
    documentation: {
        info: {
            title: "Restaurant app",
            version: "1.0.0",
            description: "Restaurant application made as an entry level test",
        },
        servers: [{ url: "http://localhost:3000", description: "Local Server" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
}));
