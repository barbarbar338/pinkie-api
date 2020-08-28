import { Injectable } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { Canvas } from "canvas-constructor";

@Injectable()
export class CanvasService {
    createBanner({
        message,
        width,
        height,
        bgColor,
        fontColor,
    }: CreateBannerDto): Buffer {
        const fontDivider = width / 16 < height ? width / 16 : height;
        const canvas = new Canvas(width, height)
            .setColor(bgColor)
            .printRectangle(0, 0, width, height)
            .setColor(fontColor)
            .setTextFont(fontDivider / (message.length / 32) + "px Arial")
            .setTextAlign("center")
            .printText(message, width / 2, height / 2 + (height / 100) * 5)
            .toBuffer();
        return canvas;
    }
}
