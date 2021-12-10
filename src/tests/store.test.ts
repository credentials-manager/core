import { Store } from "../store";
import { existsSync } from "fs";
import { Config } from "../config";
import { Credential } from "../credential";

describe("non encrypted store", () => {
	let store: Store;

	test("create a store", () => {
		store = new Store("test");

		expect(store.create()).toBeTruthy();
	});

	test("check the file exist", () => {
		expect(
			existsSync(Config.PATH + "/stores/" + store.id + ".json")
		).toBeTruthy();
	});

	test("encrypted getter is false", () => {
		expect(store.encrypted).toBeFalsy();
	});

	test("getAll contain created store", () => {
		const stores: Store[] = Store.getAll();

		expect(stores).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: store.id,
				}),
			])
		);
	});

	test("add credential", () => {
		const newCredential: Credential = store.addCredential({
			address: "127.0.0.1",
			port: 22,
			username: "user",
			password: "pass",
			protocol: "ssh",
		});

		const credential: Credential = Store.get(store.id)!.credentials[0];

		expect(credential).toMatchObject(newCredential);
	});
});

describe("encrypted store", () => {
	let store: Store;
	const password = "secret_test_password";

	test("create a store", () => {
		store = new Store("test");

		expect(store.create(password)).toBeTruthy();
	});

	test("check the file exist", () => {
		expect(existsSync(Config.PATH + "/stores/" + store.id)).toBeTruthy();
	});

	test("encrypted getter is true", () => {
		expect(store.encrypted).toBeTruthy();
	});

	test("try to unlock encrypted store without password", () => {
		try {
			Store.get(store.id);
		} catch (e) {
			if (e instanceof Error) expect(e.name).toBe("PASSWORD_REQUIRED");
		}
	});

	test("try to unlock encrypted store with wrong password", () => {
		try {
			Store.get(store.id, "wrong_password");
		} catch (e) {
			if (e instanceof Error) expect(e.name).toBe("WRONG_PASSWORD");
		}
	});
});

describe("others", () => {
	test("get not exist store", () => {
		try {
			Store.get("NOT_EXIST_STORE");
		} catch (e) {
			if (e instanceof Error) expect(e.name).toBe("STORE_NOT_FOUND");
		}
	});
});
