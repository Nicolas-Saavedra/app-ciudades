import { pbkdf2 } from "crypto";

const PASSWORD_SALT = process.env.PASSWORD_SALT;

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
