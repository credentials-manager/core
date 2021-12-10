import { encrypt } from "../encrypt";

describe("crypto", () => {
	const data = "SUPER_SECRET_DATA";
	const password = "SUPER_SECRET_PASSWORD";
	let encrypted;

	test("encrypt data", () => {
		expect(encrypt(data, password)).toBeTruthy();
	});
});
