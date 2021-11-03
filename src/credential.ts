export interface Credential {
	id?: string;
	name?: string;
	description?: string;
	protocol: string;
	address: string;
	port: number;
	username: string;
	password: string;
}
