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

	test("check encrypted getter", () => {
		expect(store.encrypted).toBeFalsy();
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

	test("check encrypted getter", () => {
		expect(store.encrypted).toBeTruthy();
	});

	test("try to unlock store without password", () => {
		expect(Store.get(store.id)).toThrowError();
	});

	test("try to unlock store with wrong password", () => {
		expect(Store.get(store.id, "wrong_password")).toThrowError();
	});
});
