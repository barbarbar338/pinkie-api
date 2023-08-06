import { Body, Controller, Get, Post } from "@nestjs/common";
import { AllowUnauthorized } from "src/decorators/allowUnauthorized";
import { User } from "src/decorators/user";
import { User as UserModel } from "src/models/user";
import { AuthDTO } from "./dto/auth";
import { AuthService } from "./service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("signup")
	@AllowUnauthorized()
	async signup(@Body() authDTO: AuthDTO): Promise<PinkieAPI.ApiRes<string>> {
		return this.authService.signup(authDTO);
	}

	@Post("signin")
	@AllowUnauthorized()
	async signin(@Body() authDTO: AuthDTO): Promise<PinkieAPI.ApiRes<string>> {
		return this.authService.signin(authDTO);
	}

	@Post("regenerate")
	async regenerateAccessToken(
		@User() user: UserModel,
	): Promise<PinkieAPI.ApiRes<string>> {
		return this.authService.regenerateAccessToken(user);
	}

	@Get("@me")
	async getUser(
		@User() user: UserModel,
	): Promise<PinkieAPI.ApiRes<PinkieAPI.User>> {
		return this.authService.getUser(user);
	}
}
