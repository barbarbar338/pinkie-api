import { Controller, Get, HttpStatus } from "@nestjs/common";
import { AllowUnauthorized } from "./decorators/allowUnauthorized";

@Controller()
export class AppController {
	@Get()
	@AllowUnauthorized()
	getHello(): PinkieAPI.ApiRes<string> {
		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: "Hello World!",
		};
	}
}
