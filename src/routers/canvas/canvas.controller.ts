import { Controller, Get, Post, Body, Res } from "@nestjs/common";
import { CanvasService } from "./canvas.service";
import { APIRes } from "pinkie-api-types";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { Response } from "express";

@Controller("canvas")
export class CanvasController {
    constructor(private readonly canvasService: CanvasService) {}

    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
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
