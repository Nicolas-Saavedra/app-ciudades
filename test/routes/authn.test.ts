import { app } from "../../src/index";
import { db } from "../../src/db/index.js";
import { usersTable } from "../../src/db/schema.js";
import {
  getHashFromString,
  signRefreshToken,
} from "../../src/services/authn.js";
import { afterEach, describe, expect, it } from "@jest/globals";
import test from "node:test";

describe("Auth test suite", () => {
  test("Authentication flow", () => {
    it("should register a user properly through the endpoint", async () => {
      const res = await app.request("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "example@example.com",
          secret: "########",
        }),
      });
      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();

      const response = await res.json();

      expect(response).toHaveProperty("access_token");
      expect(response).toHaveProperty("refresh_token");
    });

    it("should login a user that is inside the system", async () => {
      const testUser = {
        email: "example@example.com",
        secret: "########",
      };

      await db.insert(usersTable).values({
        email: testUser.email,
        secret: await getHashFromString(testUser.secret),
      });

      const res = await app.request("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          secret: testUser.secret,
        }),
      });

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();

      const response = await res.json();

      expect(response).toHaveProperty("access_token");
      expect(response).toHaveProperty("refresh_token");
    });

    it("should give a new access token from the refresh token", async () => {
      const testUser = {
        email: "example@example.com",
        secret: "########",
      };

      await db.insert(usersTable).values({
        email: testUser.email,
        secret: await getHashFromString(testUser.secret),
      });

      const refreshToken = await signRefreshToken(testUser.email);

      const res = await app.request("/auth/refresh", {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });
      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();

      const response = await res.json();

      expect(response).toHaveProperty("access_token");
    });
  });
});

afterEach(async () => {
  await db.delete(usersTable);
});
