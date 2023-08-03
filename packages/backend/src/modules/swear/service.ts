import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import replyList from "../../assets/swearReplyList";
import swearWordList from "../../assets/swearWordList";

@Injectable()
export class SwearService {
	getWordList(): PinkieAPI.ApiRes<string[]> {
		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: swearWordList,
		};
	}

	getReplyList(): PinkieAPI.ApiRes<string[]> {
		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: replyList,
		};
	}

	test(message: string): PinkieAPI.ApiRes<PinkieAPI.SwearTestRes> {
		if (!message) throw new BadRequestException("No message provided");

		const contains =
			swearWordList.filter((word) => {
				const wordExp = new RegExp(word, "gui");
				return wordExp.test(message);
			}).length > 0 || false;

		return {
			statusCode: HttpStatus.OK,
			success: true,
			data: {
				isSwear: contains,
				replies: replyList,
			},
		};
	}
}
