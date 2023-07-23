import { HttpStatus } from "@nestjs/common";

export {};

declare global {
	namespace PinkieAPI {
		interface ApiRes<T> {
			statusCode: HttpStatus;
			success: boolean;
			data: T;
		}
	}
}
