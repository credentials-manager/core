import { scryptSync, createDecipheriv } from "crypto";
import { Credential } from "./credential";
import { Config } from "./config";

export function decryptCredentials(
	data: string,
	password: string,
	salt: string,
	iv: string
): Credential[] | null {
	const encryptedText = Buffer.from(data, "hex");
	const key = scryptSync(password, Buffer.from(salt, "hex"), Config.KEY_LENGTH);

	const decipher = createDecipheriv(
		Config.ALGORITHM,
		key,
		Buffer.from(iv, "hex")
	);

	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	const decryptedString = decrypted.toString();

	if (isJSON(decryptedString)) {
		return JSON.parse(decryptedString);
	} else {
		return null;
	}
}

function isJSON(str: string): boolean {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
