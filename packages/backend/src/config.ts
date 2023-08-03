import { config } from "dotenv";
import { cleanEnv, num, str } from "envalid";

config();

const env = cleanEnv(process.env, {
	NODE_ENV: str({
		default: "development",
	}),
	PORT: num({
		default: 3000,
	}),
});

export const CONFIG = {
	...env,
};
