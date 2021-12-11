import { randomBytes, scryptSync, createCipheriv } from "crypto";
import { Credential } from "./credential";
import { Config } from "./config";
import { createPassword } from "./password";

export interface EncryptResult {
	iv: string;
	encrypted: string;
	salt: string;
}

export function encryptCredentials(
	data: Credential[],
	password: string
): EncryptResult {
	const newPassword = createPassword(password);
	const iv = randomBytes(Config.IV_LENGTH);

	const cipher = createCipheriv(Config.ALGORITHM, newPassword.key, iv);

	let encrypted = cipher.update(JSON.stringify(data));
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return {
		iv: iv.toString("hex"),
		encrypted: encrypted.toString("hex"),
		salt: newPassword.salt.toString("hex"),
	};
}
