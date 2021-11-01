import { readFileSync, writeFileSync } from "fs";
import { Config } from "./config";
import { Credential } from "./credential";
import { v4 as uuidv4 } from "uuid";

export class Store {
	public static readonly META_PATH: string = Config.PATH + "/stores.json";
	public static readonly STORE_PATH: string = Config.PATH + "/stores";

	public credentials: Credential[] = [];

	public constructor(public name: string, public id: string = uuidv4()) {}

	public static getAll(): Store[] {
		const file = readFileSync(Store.META_PATH, "utf8");
		const tmpStores = JSON.parse(file);
		const stores: Store[] = [];

		for (const tmpStore of tmpStores) {
			const store = new Store(tmpStore.name, tmpStore.id);

			const file = readFileSync(`${Store.STORE_PATH}/${store.id}.json`, "utf8");

			const credentials: Credential[] = JSON.parse(file);
			store.credentials = credentials;

			stores.push(store);
		}

		return stores;
	}

	public static get(id: string) {
		const stores: Store[] = Store.getAll();

		for (const store of stores) {
			if (store.id == id) {
				return store;
			}
		}
	}

	public addCredential(credential: Credential) {
		credential.id = uuidv4();

		this.credentials.push(credential);

		writeFileSync(
			`${Store.STORE_PATH}/${this.id}.json`,
			JSON.stringify(this.credentials)
		);
	}

	public create() {
		const stores: Store[] = Store.getAll();

		//this.id = uuidv4();
		stores.push(this);

		writeFileSync(Store.META_PATH, JSON.stringify(stores));

		writeFileSync(
			`${Store.STORE_PATH}/${this.id}.json`,
			JSON.stringify(this.credentials)
		);
	}
}
