import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { CreateAchievementDto } from "./dto/create-achievement.dto";
import { CreateOverlayDto } from "./dto/create-overlay.dto";
import { Image, registerFont } from "canvas";
import { Canvas, resolveImage } from "canvas-constructor";
import { OVERLAYS } from "src/assets/overlays";
import * as sharp from "sharp";
import fetch from "node-fetch";
import { CreateRankCardDTO } from "./dto/create-rank-card.dto";

const statusColors = {
    online: "#00ff00",
    invisible: "#d1d1e0",
    offline: "#d1d1e0",
    dnd: "#ff3300",
    idle: "#ffff00"
}

registerFont("src/assets/Minecraft.ttf", {
    family: "Minecraft",
});

@Injectable()
export class CanvasService {
    public async createRankCard({
        xp,
        level,
        xpToLevel,
        position,
        avatarURL,
        status,
        tag
    }: CreateRankCardDTO): Promise<Buffer> {
        let fix = 0;
        const avatar = await resolveImage(avatarURL)
        const percent = Math.floor((xpToLevel + xp * 100) / xpToLevel);
        const width = Math.floor((635 * percent) / 100);
        console.log(percent, width);
        const buffer = await new Canvas(934, 282)
            .setColor("#23272A")
            .printRoundedRectangle(0, 0, 934, 282, 10)
            .setColor("#16181A")
            .printRoundedRectangle(20, 37, 890, 211, 4)
            .printCircularImage(avatar, 123, 143, 80)
            .setStrokeWidth(4)
            .setStroke("#000000")
            .stroke()
            .printCircle(185, 195, 20)
            .setStrokeWidth(8)
            .stroke()
            .setColor(statusColors[status])
            .fill()
            .setColor("#484b4e")
            .printRoundedRectangle(256, 179, 635, 34, 100)
            .setStrokeWidth(2)
            .stroke()
            .setColor("#248f24")
            .printRoundedRectangle(256, 180, width, 32, 100)
            .setColor("#FEFEFE")
            .setTextFont("24px Sans")
            .setTextAlign("start")
            .measureText(tag, ({ width }) => fix = width + 350)
            .printText(tag, 260, 165)
            .setTextAlign("right")
            .setColor("#7F8384")
            .setTextFont("24px Sans")
            .measureText("/ " + xpToLevel + " XP", ({ width }) => fix = 870 - width)
            .printText("/ " + xpToLevel + " XP", 880, 165)
            .setColor("#FEFEFE")
            .printText(xp.toString(), fix, 165)
            .setTextFont("24px Sans")
            .setColor("#FEFEFE")
            .printText(level + " Level", 640, 205)
            .setColor("#2ECC71")
            .setTextAlign("right")
            .printText(`Rank: #${position}`, 870, 90)
            .toBufferAsync();
        return buffer;
    }

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
