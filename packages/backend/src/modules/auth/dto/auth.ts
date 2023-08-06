import { IsAlphanumeric, IsDefined, IsEmail, Length } from "class-validator";

export abstract class AuthDTO {
	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	@Length(3, 20)
	@IsAlphanumeric()
	password: string;
}
