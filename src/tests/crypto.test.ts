import { Credential } from "../credential";
import { decryptCredentials } from "../decrypt";
import { encryptCredentials, EncryptResult } from "../encrypt";

describe("credentials crypto", () => {
	const password = "SUPER_SECRET_PASSWORD";
	const credentials: Credential[] = [
		{
			protocol: "ssh",
			address: "localhost",
			port: 22,
			username: "root",
			password: "password",
		},
	];
	let encrypted: EncryptResult;

	test("encrypt data", () => {
		encrypted = encryptCredentials(credentials, password);
		expect(encrypted).toBeTruthy();
	});

	test("decrypt data", () => {
		const decrypted = decryptCredentials(
			encrypted.encrypted,
			password,
			encrypted.salt,
			encrypted.iv
		);

		expect(decrypted).toBeTruthy();
		expect(decrypted).toEqual(credentials);
	});
});
