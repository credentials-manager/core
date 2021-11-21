import { randomBytes, scryptSync, createCipheriv } from "crypto";
import { Config } from "./config";

export function encrypt(data: string, password: string) {
	const salt = randomBytes(Config.SALT_LENGTH);
	const key = scryptSync(password, salt, Config.KEY_LENGTH);
	const iv = randomBytes(Config.IV_LENGTH);

	const cipher = createCipheriv(Config.ALGORITHM, key, iv);

	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return {
		iv: iv.toString("hex"),
		encrypted: encrypted.toString("hex"),
		salt: salt.toString("hex"),
		password: key.toString("hex"),
	};
}
