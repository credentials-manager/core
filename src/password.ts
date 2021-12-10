import { randomBytes, scryptSync } from "crypto";
import { Config } from "./config";

export interface Password {
	key: Buffer;
	salt: Buffer;
}

export function createPassword(password: string): Password {
	const salt = randomBytes(Config.SALT_LENGTH);
	const key = scryptSync(password, salt, Config.KEY_LENGTH);

	return { salt, key };
}

export function checkPassword(
	password: string,
	salt: string,
	passwordHex: string
): boolean {
	const key = scryptSync(password, Buffer.from(salt, "hex"), Config.KEY_LENGTH);

	return key.toString("hex") === passwordHex;
}
