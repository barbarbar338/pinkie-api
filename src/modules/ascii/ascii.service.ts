import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { Fonts, textSync } from "figlet";
import { readdirSync } from "fs";
import { resolve } from "path";

const allFonts = readdirSync(
	resolve(process.cwd(), "node_modules", "figlet", "importable-fonts"),
).map((font) => font.replace(".js", ""));

@Injectable()
export class AsciiService {
	convertMessage(
		message: string,
		font: Fonts = "Standard",
	): PinkieAPI.ApiRes<string> {
		if (!message) throw new BadRequestException("No message provided");

		if (!allFonts.includes(font))
			throw new BadRequestException({
				message: "Invalid font provided",
				availableFonts: allFonts,
			});

		const converted = textSync(message, font);

		return {
			statusCode: HttpStatus.OK,
			data: converted,
			success: true,
		};
	}
}
