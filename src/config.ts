import { homedir } from "os";
import { existsSync, mkdirSync } from "fs";

export class Config {
	public static get PATH(): string {
		const path: string = homedir() + "/.credman";

		if (!existsSync(path)) {
			mkdirSync(path);
		}

		return path;
	}
}
