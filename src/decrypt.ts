import { scryptSync, createDecipheriv } from "crypto";
import { Config } from "./config";

export function decrypt(
	data: string,
	password: string,
	salt: string,
	iv: string
): string {
	const encryptedText = Buffer.from(data, "hex");
	const key = scryptSync(password, Buffer.from(salt, "hex"), Config.KEY_LENGTH);

	const decipher = createDecipheriv(
		Config.ALGORITHM,
		key,
		Buffer.from(iv, "hex")
	);

	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}
