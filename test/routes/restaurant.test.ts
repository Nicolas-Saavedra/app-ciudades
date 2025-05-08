import { afterEach, describe, expect, test } from "@jest/globals";
import { db } from "../../src/db";
import { usersTable } from "../../src/db/schema";
import { getHashFromString, signAccessToken } from "../../src/services/authn";
import { app } from "../../src/app";

describe("Restaurant test suite", () => {
  test("should return restaurants near the city specified", async () => {
    const testUser = {
      email: "example@example.com",
      secret: "########",
    };

    await db.insert(usersTable).values({
      email: testUser.email,
      secret: await getHashFromString(testUser.secret),
    });

    const refreshToken = await signAccessToken(testUser.email);

    const res = await app.request("/restaurants/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        city: "Bogota",
      }),
    });
    expect(res.status).toEqual(200);
    expect(res.body).not.toBeNull();
  });
});

afterEach(async () => {
  await db.delete(usersTable);
});
