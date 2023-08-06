import { config } from "dotenv";
import { cleanEnv, num, str } from "envalid";
import { Pika } from "pika-id";

config();

const env = cleanEnv(process.env, {
	NODE_ENV: str({
		default: "development",
	}),
	PORT: num({
		default: 3000,
	}),
	SECRET: str({
		default: "pinkie-api-secret-please-change",
	}),
});

export const CONFIG = {
	...env,
	dailyRequests: {
		free: 5,
		premium: 100000, // TODO: Add premium feature
	},
	pika: new Pika(["user", "access_token"]),
};
