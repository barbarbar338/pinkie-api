import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { CreateAchievementDto } from "./dto/create-achievement.dto";
import { CreateOverlayDto } from "./dto/create-overlay.dto";
import { Image, registerFont } from "canvas";
import { Canvas, resolveImage } from "canvas-constructor";
import { OVERLAYS } from "src/assets/overlays";
import * as sharp from "sharp";
import fetch from "node-fetch";

import { createCanvas, loadImage } from "canvas";
import { readFileSync } from "fs";
import { CreateRankCardDTO } from "./dto/create-rank-card.dto";

const icons = {
    online: readFileSync("src/assets/status_icons/online.png"),
    invisible: readFileSync("src/assets/status_icons/offline.png"),
    offline: readFileSync("src/assets/status_icons/offline.png"),
    dnd: readFileSync("src/assets/status_icons/dnd.png"),
    idle: readFileSync("src/assets/status_icons/idle.png")
};

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
        const canvas = createCanvas(750, 240);
        const ctx = canvas.getContext("2d");
        const avatar = await loadImage(avatarURL);
        const statusIcon = await loadImage(icons[status]);
        ctx.fillStyle = "rgba(0, 0, 0, 0.40)";
        ctx.fill();
        ctx.fillRect(25, 20, 700, 170);
        ctx.fillStyle = "rgba(0, 0, 0, 0.30)";
        ctx.fill();
        ctx.fillRect(0, 0, 750, 210);
        ctx.beginPath();
        ctx.fillStyle = "#999999";
        ctx.arc(
            275.5,
            154.75,
            18.5,
            1.5 * Math.PI,
            0.5 * Math.PI,
            true,
        );
        ctx.fill();
        ctx.fillRect(275.5, 136.15, 400, 37.5);
        ctx.arc(
            675.5,
            154.75,
            18.75,
            1.5 * Math.PI,
            0.5 * Math.PI,
            false,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#3af2ec";
        ctx.arc(
            275.5,
            154.75,
            18.5,
            1.5 * Math.PI,
            0.5 * Math.PI,
            true,
        );
        ctx.fill();
        ctx.fillRect(275.5, 136.25, xp * 1.6, 37.5);
        ctx.arc(
            275.5 + (xp * 1.6),
            154,
            18.75,
            1.5 * Math.PI,
            0.5 * Math.PI,
            false,
        );
        ctx.fill();
        ctx.fillStyle = "#3af2ec";
        ctx.font = "28px Impact";
        ctx.textAlign = "right";
        ctx.fillText(`Rank #${position} | Level ${level}`, 690, 60);
        ctx.font = "20px Impact";
        ctx.textAlign = "right";
        ctx.fillText(`${xp} / ${xpToLevel} XP`, 690, 120);
        ctx.fillStyle = "#bfbfbf";
        ctx.font = "28px Impact";
        ctx.textAlign = "left";
        ctx.fillText(tag, 270, 120);
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.arc(110, 105, 70, 0, Math.PI * 2, true);
        ctx.drawImage(statusIcon, 135, 135, 50, 50);
        ctx.clip();
        ctx.drawImage(avatar, 40, 35, 140, 140);
        ctx.drawImage(statusIcon, 135, 135, 50, 50);
        return canvas.toBuffer();
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
