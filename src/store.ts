import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { Config } from "./config";
import { Credential } from "./credential";
import { v4 as uuidv4 } from "uuid";
import { encrypt } from "./encrypt";

interface EncryptInfo {
	iv: string;
	salt: string;
	password: string;
}

export class Store {
	public static readonly META_PATH: string = Config.PATH + "/stores.json";
	public static readonly STORE_PATH: string = Config.PATH + "/stores";

	public credentials: Credential[] = [];

	private encrypt?: EncryptInfo;

	private password?: string;

	public constructor(public name: string, public id: string = uuidv4()) {}

	public static getAll(): Store[] {
		if (!existsSync(Store.META_PATH)) {
			return [];
		}

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

	public get encrypted(): boolean {
		return this.encrypt != undefined;
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

	private toJSON() {
		if (this.encrypt) {
			return {
				id: this.id,
				name: this.name,
				encrypt: this.encrypt,
			};
		} else {
			return {
				id: this.id,
				name: this.name,
			};
		}
	}

	private update() {
		if (this.password) {
			const encrypted = encrypt(
				JSON.stringify(this.credentials),
				this.password
			);

			this.encrypt = {
				iv: encrypted.iv,
				salt: encrypted.salt,
				password: encrypted.password,
			};

			writeFileSync(`${Store.STORE_PATH}/${this.id}`, encrypted.encrypted);
		} else {
			writeFileSync(
				`${Store.STORE_PATH}/${this.id}.json`,
				JSON.stringify(this.credentials)
			);
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

	public deleteCredential(id: string): void {
		this.credentials = this.credentials.filter(
			(credential) => credential.id != id
		);

		writeFileSync(
			`${Store.STORE_PATH}/${this.id}.json`,
			JSON.stringify(this.credentials)
		);
	}

	public create(password?: string): boolean {
		this.password = password;

		const stores: Store[] = Store.getAll();

		//this.id = uuidv4();
		stores.push(this);

		const storesJSON = [];

		for (const store of stores) {
			storesJSON.push(store.toJSON());
		}

		if (!existsSync(Store.STORE_PATH)) {
			mkdirSync(Store.STORE_PATH);
		}

		this.update();

		writeFileSync(Store.META_PATH, JSON.stringify(storesJSON));

		return true;
	}
}
