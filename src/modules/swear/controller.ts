import { Controller, Get, Query } from "@nestjs/common";
import { SwearService } from "./service";

@Controller("swear")
export class SwearController {
	constructor(private readonly swearService: SwearService) {}

	@Get("wordlist")
	getWordList(): PinkieAPI.ApiRes<string[]> {
		return this.swearService.getWordList();
	}

	@Get("replylist")
	getReplyList(): PinkieAPI.ApiRes<string[]> {
		return this.swearService.getReplyList();
	}

	@Get("test")
	test(
		@Query("message") message: string,
	): PinkieAPI.ApiRes<PinkieAPI.SwearTestRes> {
		return this.swearService.test(message);
	}
}
