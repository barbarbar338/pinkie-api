import { Injectable, Logger } from "@nestjs/common";
import { schedule } from "node-cron";
import { CONFIG } from "src/config";

@Injectable()
export class RatelimitUtil {
	private readonly logger = new Logger(RatelimitUtil.name);
	private requests = new Map<string, number>();

	constructor() {
		const job = schedule("0 1 * * *", () => {
			this.logger.log("Cleaning up ratelimit requests.");

			this.requests.clear();
		});

		job.start();

		this.logger.log("Ratelimit job started.");
	}

	public getRemaining(token: string) {
		const requests = this.requests.get(token);
		return CONFIG.dailyRequests.free - (requests || 0);
	}

	public makeRequest(token: string) {
		const requests = this.requests.get(token);
		const canMake = !requests || requests < CONFIG.dailyRequests.free;
		const remaining = this.getRemaining(token);

		if (canMake) {
			this.requests.set(token, (requests || 0) + 1);
		}

		return {
			canMake,
			remaining,
		};
	}
}