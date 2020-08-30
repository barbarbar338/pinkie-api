import { Controller, Get, Post, Body, Res, BadRequestException, Query } from "@nestjs/common";
import { CanvasService } from "./canvas.service";
import { APIRes } from "pinkie-api-types";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { CreateAchievementDto } from "./dto/create-achievement.dto";
import { Response } from "express";
import { ICONS } from "src/assets/mcIcons";

@Controller("canvas")
export class CanvasController {
    constructor(private readonly canvasService: CanvasService) {}

    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    @Get("mcachievement")
    async createAchievementFromQuery(
        @Query() createAchievementDto: CreateAchievementDto,
        @Res() res: Response
    ): Promise<Response> {
        if (!Object.values(ICONS).includes(createAchievementDto.icon)) throw new BadRequestException(`icon ${createAchievementDto.icon} not found`)
        return res
            .type("image/webp")
            .send((await this.canvasService.createAchievement(createAchievementDto)));
    }
    
    @Get("banner")
    createBannerFromQuery(
        @Query() createBannerDto: CreateBannerDto,
        @Res() res: Response
    ): Response {
        return res
            .type("image/webp")
            .send(this.canvasService.createBanner(createBannerDto));
    }

    @Post("mcachievement")
    async createAchievement(
        @Body() createAchievementDto: CreateAchievementDto,
        @Res() res: Response
    ): Promise<Response> {
        if (!Object.values(ICONS).includes(createAchievementDto.icon)) throw new BadRequestException(`icon ${createAchievementDto.icon} not found`)
        return res
            .type("image/webp")
            .send((await this.canvasService.createAchievement(createAchievementDto)));
    }

    @Post("banner")
    createBanner(
        @Body() createBannerDto: CreateBannerDto,
        @Res() res: Response,
    ): Response {
        return res
            .type("image/webp")
            .send(this.canvasService.createBanner(createBannerDto));
    }
}
