import { Controller, Get, Post, Body, Res, Param, Query } from "@nestjs/common";
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
    
    @Get("banner/:width/:height/:bgColor/:fontColor/create")
    createBannerFromParams(
        @Param("width") width: number,
        @Param("height") height: number,
        @Param("bgColor") bgColor: string,
        @Param("fontColor") fontColor: string,
        @Query("message") message: string,
        @Res() res: Response
    ): Response{
        const createBannerDto: CreateBannerDto = {
            message,
            width,
            height,
            bgColor: "#" + bgColor,
            fontColor: "#" + fontColor
        }
        return res
            .type("image/webp")
            .send(this.canvasService.createBanner(createBannerDto));
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
