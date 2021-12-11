import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { Config } from "./config";
import { Credential } from "./credential";
import { v4 as uuidv4 } from "uuid";
import { encryptCredentials } from "./encrypt";
import { checkPassword } from "./password";
import { decryptCredentials } from "./decrypt";

interface EncryptInfo {
	iv: string;
	salt: string;
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
		const tmpStores: Store[] = JSON.parse(file);
		const stores: Store[] = [];

		for (const tmpStore of tmpStores) {
			const store: Store = new Store(tmpStore.name, tmpStore.id);

			if (tmpStore.encrypt) {
				store.encrypt = tmpStore.encrypt;
			}

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

	public static get(id: string, password?: string): Store {
		const stores: Store[] = Store.getAll();

		for (const store of stores) {
			if (store.id == id) {
				if (store.encrypt) {
					if (!password) {
						const error: Error = new Error("Password required");
						error.name = "PASSWORD_REQUIRED";
						throw error;
					} else {
						const file = readFileSync(
							`${Store.STORE_PATH}/${store.id}`,
							"utf8"
						);

						const credentials: Credential[] | null = decryptCredentials(
							file,
							password,
							store.encrypt.salt,
							store.encrypt.iv
						);
						if (credentials) {
							store.credentials = credentials;
						} else {
							const error: Error = new Error("Password incorrect");
							error.name = "WRONG_PASSWORD";
							throw error;
						}
					}
				} else {
					const returnStore: Store = new Store(store.name, store.id);
					returnStore.loadCredentials();
					return returnStore;
				}
			}
		}

		const error: Error = new Error("Store not found");
		error.name = "STORE_NOT_FOUND";
		throw error;
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
			const encrypted = encryptCredentials(this.credentials, this.password);

			this.encrypt = {
				iv: encrypted.iv,
				salt: encrypted.salt,
			};

			writeFileSync(`${Store.STORE_PATH}/${this.id}`, encrypted.encrypted);
		} else {
			writeFileSync(
				`${Store.STORE_PATH}/${this.id}.json`,
				JSON.stringify(this.credentials)
			);
		}
	}

	public addCredential(credential: Credential): Credential {
		credential.id = uuidv4();

		this.credentials.push(credential);

		writeFileSync(
			`${Store.STORE_PATH}/${this.id}.json`,
			JSON.stringify(this.credentials)
		);

		return credential;
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

		this.update();

		const storesJSON = [];

		for (const store of stores) {
			storesJSON.push(store.toJSON());
		}

		if (!existsSync(Store.STORE_PATH)) {
			mkdirSync(Store.STORE_PATH);
		}

		writeFileSync(Store.META_PATH, JSON.stringify(storesJSON));

		return true;
	}
}
