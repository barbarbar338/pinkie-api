import {
	ConflictException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import argon2 from "argon2";
import { removeProperties } from "remove-properties";
import { CONFIG } from "src/config";
import { User } from "src/models/user";
import { RatelimitUtil } from "src/utils/ratelimit";
import { AuthDTO } from "./dto/auth";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User)
		private readonly userModel: typeof User,
		private readonly ratelimitUtil: RatelimitUtil,
	) {}

	async findUserByAccessToken(token: string) {
		const user = await this.userModel.findOne({
			where: {
				access_token: token,
			},
		});

		if (!user) throw new UnauthorizedException("Invalid access token.");

		return user;
	}

	async signup({
		email,
		password,
	}: AuthDTO): Promise<PinkieAPI.ApiRes<string>> {
		const conflict = await this.userModel.findOne({
			where: {
				email,
			},
		});

		if (conflict)
			throw new ConflictException(
				"A user with this email is already exists, please try another email.",
			);

		const passwordHash = await argon2.hash(password);

		const user = await this.userModel.create({
			email,
			password: passwordHash,
		});

		return {
			statusCode: HttpStatus.CREATED,
			success: true,
			data: user.access_token,
		};
	}

	async signin({
		email,
		password,
	}: AuthDTO): Promise<PinkieAPI.ApiRes<string>> {
		const user = await this.userModel.findOne({
			where: {
				email,
			},
		});

		if (!user)
			throw new ConflictException(
				"This email is not registered, please try to create a new one.",
			);

		const isPasswordValid = await argon2.verify(user.password, password);

		if (!isPasswordValid)
			throw new UnauthorizedException("Invalid password provided.");

		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: user.access_token,
		};
	}

	async regenerateAccessToken(user: User): Promise<PinkieAPI.ApiRes<string>> {
		user.access_token = CONFIG.pika.gen("access_token");

		await user.save();

		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: user.access_token,
		};
	}

	async getUser(user: User): Promise<PinkieAPI.ApiRes<PinkieAPI.User>> {
		const cleanRes = removeProperties<User, "password">(user.dataValues, [
			"password",
		]);

		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: {
				...cleanRes,
				remaining_requests: this.ratelimitUtil.getRemaining(
					user.access_token,
					user.type,
				),
			},
		};
	}
}
