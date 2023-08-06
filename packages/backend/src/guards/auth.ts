import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthService } from "src/modules/auth/service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly auhtService: AuthService,
	) {}

	async canActivate(context: ExecutionContext) {
		const allowUnauthorized = this.reflector.get<boolean>(
			"allowUnauthorized",
			context.getHandler(),
		);

		if (allowUnauthorized) return true;

		const request = context.switchToHttp().getRequest<Request>();

		let token = request.headers.authorization;
		if (!token) throw new UnauthorizedException("Access token expected.");

		token = token.startsWith("Bearer")
			? token.match(/[^Bearer]\S+/g)[0].trim()
			: token;

		if (!token) throw new UnauthorizedException("Access token expected.");

		const user = await this.auhtService.findUserByAccessToken(token);
		if (!user) throw new UnauthorizedException("Invalid access token.");

		(request as any).user = user;

		return true;
	}
}
