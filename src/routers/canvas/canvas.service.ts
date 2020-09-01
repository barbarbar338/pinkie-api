import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { CreateAchievementDto } from "./dto/create-achievement.dto";
import { CreateOverlayDto } from "./dto/create-overlay.dto";
import { Image, registerFont } from "canvas";
import { Canvas, resolveImage } from "canvas-constructor";
import { OVERLAYS } from "src/assets/overlays";
import * as sharp from "sharp";
import fetch from "node-fetch";

registerFont("src/assets/Minecraft.ttf", {
    family: "Minecraft",
});

@Injectable()
export class CanvasService {
    private async createMinecraftCanvas(): Promise<Canvas> {
        const background = await resolveImage(
            "src/assets/minecraft_achievement_background.png",
        );
        const canvas = new Canvas(503, 100).printImage(background, 0, 0);
        return canvas;
    }

    private async fetchMinecraftImage(name: string): Promise<Image> {
        const image = await resolveImage(
            `src/assets/minecraft_item_icons/${name}.png`,
        );
        return image;
    }

    async createOverlay({
        imageURL,
        overlay,
    }: CreateOverlayDto): Promise<Buffer> {
        if (!Object.values(OVERLAYS).includes(overlay))
            throw new BadRequestException(`overlay ${overlay} not found`);
        const imageBuffer = await fetch(imageURL)
            .then(res => res.buffer())
            .catch(() => {
                throw new BadRequestException(
                    `${imageURL} is not a valid image URL`,
                );
            });
        const resizedBuffer = await sharp(imageBuffer)
            .resize(330, 330)
            .png({
                quality: 70,
            })
            .toBuffer()
            .catch(() => {
                throw new BadRequestException(
                    `${imageURL} is not a valid image URL`,
                );
            });
        const resizedImage = await resolveImage(resizedBuffer);
        const overlayImage = await resolveImage(
            `src/assets/overlays/${overlay}.png`,
        );
        const buffer = new Canvas(330, 330)
            .printImage(resizedImage, 0, 0)
            .printImage(overlayImage, 0, 0)
            .toBuffer();
        return buffer;
    }

    async createAchievement({
        icon,
        title,
        content,
    }: CreateAchievementDto): Promise<Buffer> {
        const image = await this.fetchMinecraftImage(icon);
        const buffer = (await this.createMinecraftCanvas())
            .setTextFont("24px Minecraft")
            .setTextAlign("left")
            .setColor("#f8f628")
            .printText(title, 125, 40)
            .setColor("#ffffff")
            .printText(content, 125, 80)
            .printImage(image, 35, 20)
            .toBuffer();
        return buffer;
    }

    createBanner({
        message,
        width = 750,
        height = 250,
        bgColor = "211d1c",
        fontColor = "ffffff",
    }: CreateBannerDto): Buffer {
        const size = new Canvas(width, height)
            .setTextFont("128px Tahoma")
            .measureText(message);
        const newSize = size.width < width ? 120 : (width / size.width) * 120;
        const canvas = new Canvas(width, height)
            .setColor(`#${bgColor}`)
            .printRectangle(0, 0, width, height)
            .setColor(`#${fontColor}`)
            .setTextFont(`${newSize}px Tahoma`)
            .setTextBaseline("middle")
            .setTextAlign("center")
            .printText(message, width / 2, (height / 100) * 40)
            .toBuffer();
        return canvas;
    }
}
