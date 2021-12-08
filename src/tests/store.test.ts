import { Store } from "../store";
import { existsSync } from "fs";
import { Config } from "../config";

describe("create non encrypted store", () => {
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
});

describe("create encrypted store", () => {
	let store: Store;

	test("create a store", () => {
		store = new Store("test");

		expect(store.create("secret")).toBeTruthy();
	});

	test("check the file exist", () => {
		expect(existsSync(Config.PATH + "/stores/" + store.id)).toBeTruthy();
	});

	test("check encrypted getter", () => {
		expect(store.encrypted).toBeTruthy();
	});
});
