import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { CONFIG } from "src/config";
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

		let token = request.headers.authorization;
		if (!token) throw new UnauthorizedException("Access token expected.");

		token = token.startsWith("Bearer")
			? token.match(/[^Bearer]\S+/g)[0].trim()
			: token;

		if (!token) throw new UnauthorizedException("Access token expected.");

		const { canMake } = this.ratelimitUtil.makeRequest(token);

		if (!canMake)
			throw new UnauthorizedException(
				`You have exceeded your daily request limit. You can make ${CONFIG.dailyRequests.free} more requests tomorrow.`,
			);

		return true;
	}
}
