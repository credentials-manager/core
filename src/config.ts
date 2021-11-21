import { homedir } from "os";
import { existsSync, mkdirSync } from "fs";

export class Config {
	public static readonly IV_LENGTH: number = 16;
	public static readonly ALGORITHM: string = "aes-256-ctr";
	public static readonly SALT_LENGTH: number = 16;
	public static readonly KEY_LENGTH: number = 32;

	public static get PATH(): string {
		const path: string = homedir() + "/.credman";

		if (!existsSync(path)) {
			mkdirSync(path);
		}

		return path;
	}
}
