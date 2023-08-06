import { HttpStatus } from "@nestjs/common";

export {};

declare global {
	namespace PinkieAPI {
		interface ApiRes<T> {
			statusCode: HttpStatus;
			success: boolean;
			data: T;
		}

		interface SwearTestRes {
			isSwear: boolean;
			replies: string[];
		}

		enum UserType {
			FREE,
			PREMIUM,
		}

		interface User {
			user_id: string;
			email: string;
			access_token: string;
			type: UserType;
			remaining_requests: number;
		}
	}
}
