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

			store.loadCredentials();

			stores.push(store);
		}

		return stores;
	}

	private loadCredentials() {
		const file = readFileSync(`${Store.STORE_PATH}/${this.id}.json`, "utf8");

		const credentials: Credential[] = JSON.parse(file);
		this.credentials = credentials;
	}

	public static get(id: string) {
		const stores: Store[] = Store.getAll();

		for (const store of stores) {
			if (store.id == id) {
				return store;
			}
		}
	}

	public toJSON() {
		return {
			name: this.name,
			id: this.id,
		};
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

		const storesJSON = [];

		for (const store of stores) {
			storesJSON.push(store.toJSON());
		}

		writeFileSync(Store.META_PATH, JSON.stringify(storesJSON));

		writeFileSync(
			`${Store.STORE_PATH}/${this.id}.json`,
			JSON.stringify(this.credentials)
		);
	}
}
