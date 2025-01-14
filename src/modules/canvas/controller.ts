import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { CanvasService } from "./service";

@Controller("canvas")
export class CanvasController {
	constructor(private readonly canvasService: CanvasService) {}

	@Get("banner.:extension")
	getBanner(
		@Param("extension") extension: string,
		@Query("message") text: string,
		@Query("bgColor") bgColor: string,
		@Query("textColor") textColor: string,
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

	@Get("achievement.:extension")
	getAchievement(
		@Param("extension") extension: string,
		@Query("title") title: string,
		@Query("message") message: string,
		@Query("icon") icon: string,
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

	@Get("overlay.:extension")
	getOverlay(
		@Param("extension") extension: string,
		@Query("avatar") avatar: string,
		@Query("overlay") overlay: string,
		@Res() res: Response,
	): Promise<void> {
		return this.canvasService.createOverlay(
			res,
			avatar,
			overlay,
			extension,
		);
	}

	@Get("rankcard.:extension")
	getRankCard(
		@Param("extension") extension: string,
		@Query("xp") xp: number,
		@Query("level") level: number,
		@Query("xpToLevel") xpToLevel: number,
		@Query("position") position: number,
		@Query("avatar") avatar: string,
		@Query("status") status: string,
		@Query("tag") tag: string,
		@Query("color") color: string,
		@Res() res: Response,
	): Promise<void> {
		return this.canvasService.createLevelCard(
			res,
			xp,
			level,
			xpToLevel,
			position,
			avatar,
			status,
			tag,
			color,
			extension,
		);
	}
}
