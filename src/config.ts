import { homedir } from "os";

export class Config {
	public static readonly PATH: string = homedir() + "/.credman";
}
