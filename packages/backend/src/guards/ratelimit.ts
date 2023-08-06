import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { CONFIG } from "src/config";
import { User } from "src/models/user";
import { RatelimitUtil } from "src/utils/ratelimit";

@Injectable()
export class RatelimitGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly ratelimitUtil: RatelimitUtil,
	) {}

	canActivate(context: ExecutionContext) {
		// if user is not authorized that means them are not logged in and making request as a guest
		// so we will allow them to make request without any rate limit.
		const allowUnauthorized = this.reflector.get<boolean>(
			"allowUnauthorized",
			context.getHandler(),
		);
		const noRatelimit = this.reflector.get<boolean>(
			"noRateLimit",
			context.getHandler(),
		);

		if (noRatelimit || allowUnauthorized) return true;

		const request = context.switchToHttp().getRequest<Request>();

		const user = (request as any).user as User;
		if (!user) throw new UnauthorizedException("Access token expected.");

		const { canMake } = this.ratelimitUtil.makeRequest(
			user.access_token,
			user.type,
		);

		if (!canMake)
			throw new UnauthorizedException(
				`You have exceeded your daily request limit. You can make ${CONFIG.dailyRequests.free} more requests tomorrow.`,
			);

		return true;
	}
}
