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
        const size = new Canvas(width, height)
            .setTextFont("128px Tahoma")
            .measureText(message)
        const newSize = size.width < width ? 120 : (width / size.width) * 120;
        const canvas = new Canvas(width, height)
            .setColor(bgColor)
            .printRectangle(0, 0, width, height)
            .setColor(fontColor)
            .setTextFont(`${newSize}px Tahoma`)
            .setTextBaseline("middle")
            .setTextAlign("center")
            .printText(message, width / 2, (height / 100) * 40)
            .toBuffer();
        return canvas;
    }
}
