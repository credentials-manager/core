import { checkPassword, createPassword, Password } from "../password";

describe("password verification", () => {
	const plainPassword = "SECRET_PASSWORD";
	let password: Password;

	test("create password", () => {
		password = createPassword(plainPassword);

		expect(password).toBeTruthy();
	});

	test("check password", () => {
		expect(
			checkPassword(
				plainPassword,
				password.salt.toString("hex"),
				password.key.toString("hex")
			)
		).toBeTruthy();
	});
});
