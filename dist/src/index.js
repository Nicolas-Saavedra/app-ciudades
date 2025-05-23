import { configDotenv } from "dotenv";
import { app } from "./app.js";
import { serve } from "@hono/node-server";
configDotenv();
serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
