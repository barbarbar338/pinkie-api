import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { CanvasService } from "./service";

@Controller("canvas")
export class CanvasController {
	constructor(private readonly canvasService: CanvasService) {}

	@Get("banner")
	getBanner(
		@Query("message") text: string,
		@Query("bgColor") bgColor: string,
		@Query("textColor") textColor: string,
		@Query("extension") extension: string,
		@Query("width") width: number,
		@Query("height") height: number,
		@Res() res: Response,
	): Promise<void> {
		return this.canvasService.createBanner(
			res,
			text,
			bgColor,
			textColor,
			extension,
			width,
			height,
		);
	}

	@Get("achievement")
	getAchievement(
		@Query("title") title: string,
		@Query("message") message: string,
		@Query("icon") icon: string,
		@Query("extension") extension: string,
		@Res() res: Response,
	): Promise<void> {
		return this.canvasService.createAchievement(
			res,
			title,
			message,
			icon,
			extension,
		);
	}
}
