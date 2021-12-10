import { randomBytes, scryptSync, createCipheriv } from "crypto";
import { Config } from "./config";
import { createPassword } from "./password";

export function encrypt(data: string, password: string) {
	const newPassword = createPassword(password);
	const iv = randomBytes(Config.IV_LENGTH);

	const cipher = createCipheriv(Config.ALGORITHM, newPassword.key, iv);

	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return {
		iv: iv.toString("hex"),
		encrypted: encrypted.toString("hex"),
		salt: newPassword.salt.toString("hex"),
		password: newPassword.key.toString("hex"),
	};
}
