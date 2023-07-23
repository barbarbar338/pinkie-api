import { Controller, Get, Query } from "@nestjs/common";
import { Fonts } from "figlet";
import { AsciiService } from "./service";

@Controller("ascii")
export class AsciiController {
	constructor(private readonly asciiService: AsciiService) {}

	@Get()
	convert(
		@Query("message") message: string,
		@Query("font") font: Fonts,
	): PinkieAPI.ApiRes<string> {
		return this.asciiService.convertMessage(message, font);
	}
}
