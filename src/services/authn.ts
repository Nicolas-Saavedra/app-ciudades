import { pbkdf2 } from "crypto";
import { sign } from "hono/jwt";

const PASSWORD_SALT = process.env.PASSWORD_SALT;
const JWT_SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY;
const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;

export const getHashFromString = async (secret: string) => {
  return new Promise<string>((resolve, reject) => {
    pbkdf2(secret, PASSWORD_SALT!, 600_000, 64, "sha512", (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(derivedKey.toString());
    });
  });
};

export const signAccessToken = async (sub: string) => {
  return await sign(
    {
      sub: sub,
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
    },
    JWT_SECRET_ACCESS_KEY!,
  );
};

export const signRefreshToken = async (sub: string) => {
  return await sign(
    {
      sub: sub,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    },
    JWT_SECRET_REFRESH_KEY!,
  );
};
