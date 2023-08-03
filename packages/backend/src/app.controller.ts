import { Controller, Get, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
	@Get()
	getHello(): PinkieAPI.ApiRes<string> {
		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: "Hello World!",
		};
	}
}
