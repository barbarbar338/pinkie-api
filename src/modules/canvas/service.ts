import { BadRequestException, Injectable } from "@nestjs/common";
import { Canvas, createCanvas, loadImage, registerFont } from "canvas";
import { Response } from "express";
import { readdirSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

registerFont(
	resolve(process.cwd(), "src", "assets", "fonts", "Minecraft.ttf"),
	{
		family: "Minecraft",
	},
);

registerFont(resolve(process.cwd(), "src", "assets", "fonts", "Roboto.ttf"), {
	family: "Roboto",
});

const colorRegex = /^([0-9a-f]{3}){1,2}$/i;
const extensions = ["png", "jpeg", "webp", "tiff"];
const overlays = readdirSync(
	resolve(process.cwd(), "src", "assets", "overlays"),
).map((file) => file.split(".")[0]);
const icons = readdirSync(
	resolve(process.cwd(), "src", "assets", "minecraft_item_icons"),
).map((file) => file.split(".")[0]);

const statusColors = {
	online: "#00ff00",
	invisible: "#d1d1e0",
	offline: "#d1d1e0",
	dnd: "#ff3300",
	idle: "#ffff00",
};

@Injectable()
export class CanvasService {
	private async toExtension(buffer: Buffer, extension: string) {
		return sharp(buffer)
			[extension]({
				quality: 65,
			})
			.toBuffer();
	}

	private async createMinecraftCanvas(): Promise<Canvas> {
		const canvas = createCanvas(503, 100);
		const ctx = canvas.getContext("2d");

		const background = await loadImage(
			resolve(
				process.cwd(),
				"src",
				"assets",
				"minecraft_achievement_background.png",
			),
		);

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		return canvas;
	}

	private formatNumber(longNumber: number): string {
		if (longNumber < 1000) return longNumber.toString();
		let length = longNumber.toString().length;
		const decimal = Math.pow(10, 2);
		length -= length % 3;
		const outputNum =
			Math.round((longNumber * decimal) / Math.pow(10, length)) / decimal;
		const short = " kMGTPE"[length / 3];
		return (outputNum + short).trim();
	}

	private invertColor(hex: string, bw: boolean): string {
		if (hex.indexOf("#") === 0) hex = hex.slice(1);
		if (hex.length === 3)
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		const red = parseInt(hex.slice(0, 2), 16);
		const green = parseInt(hex.slice(2, 4), 16);
		const blue = parseInt(hex.slice(4, 6), 16);
		if (bw)
			return red * 0.299 + green * 0.587 + blue * 0.114 > 186
				? "#000000"
				: "#FFFFFF";
		const newRed = ([0, 0] + (255 - red).toString(16)).slice(-2);
		const newGreen = ([0, 0] + (255 - green).toString(16)).slice(-2);
		const newBlue = ([0, 0] + (255 - blue).toString(16)).slice(-2);
		return "#" + newRed + newGreen + newBlue;
	}

	private fetchMinecraftImage = (name: string) =>
		loadImage(
			resolve(
				process.cwd(),
				"src",
				"assets",
				"minecraft_item_icons",
				`${name}.png`,
			),
		);

	async createBanner(
		res: Response,
		text: string,
		bgColor?: string,
		textColor?: string,
		extension?: string,
		width?: number,
		height?: number,
	): Promise<void> {
		if (!text) throw new BadRequestException("No message provided");
		if (bgColor && !colorRegex.test(bgColor))
			throw new BadRequestException("Invalid background color");
		if (textColor && !colorRegex.test(textColor))
			throw new BadRequestException("Invalid text color");
		if (extension && !extensions.includes(extension))
			throw new BadRequestException({
				message: "Invalid extension",
				availableExtensions: extensions,
			});
		if (width && isNaN(width))
			throw new BadRequestException("Invalid width");
		if (height && isNaN(height))
			throw new BadRequestException("Invalid height");
		if (width && (width > 2000 || width < 100))
			throw new BadRequestException("Width must be between 100 and 2000");
		if (height && (height > 2000 || height < 100))
			throw new BadRequestException(
				"Height must be between 100 and 2000",
			);

		bgColor = bgColor ? `#${bgColor}` : "black";
		textColor = textColor ? `#${textColor}` : "white";
		extension = extension ? extension : "png";
		width = width ? width : 1280;
		height = height ? height : 720;

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const fontSize = 40;
		ctx.font = `${fontSize}px Roboto`;

		ctx.fillStyle = textColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		const x = canvas.width / 2;
		const y = canvas.height / 2;
		const maxLineWidth = 1000;
		const words = text.split(" ");
		let line = "";
		let lines = [];

		words.forEach((word) => {
			const testLine = line + word + " ";
			const metrics = ctx.measureText(testLine);
			const testWidth = metrics.width;
			if (testWidth > maxLineWidth) {
				lines.push(line);
				line = word + " ";
			} else {
				line = testLine;
			}
		});
		lines.push(line);

		let currentY = y - (lines.length - 1) * fontSize * 0.5;
		lines.forEach((line) => {
			ctx.fillText(line.trim(), x, currentY);
			currentY += fontSize;
		});

		const canvasBuffer = canvas.toBuffer();

		const buffer = await this.toExtension(canvasBuffer, extension);

		res.set("Content-Type", `image/${extension}`).send(buffer);
	}

	async createAchievement(
		res: Response,
		title: string,
		message: string,
		icon: string,
		extension?: string,
	): Promise<void> {
		if (!title) throw new BadRequestException("No title provided");
		if (!message) throw new BadRequestException("No message provided");
		if (!icon) throw new BadRequestException("No icon provided");
		if (!icons.includes(icon))
			throw new BadRequestException({
				message: "Invalid icon",
				availableIcons: icons,
			});
		if (extension && !extensions.includes(extension))
			throw new BadRequestException({
				message: "Invalid extension",
				availableExtensions: extensions,
			});

		extension = extension ? extension : "png";

		const image = await this.fetchMinecraftImage(icon);

		const canvas = await this.createMinecraftCanvas();

		const ctx = canvas.getContext("2d");

		ctx.drawImage(image, 20, 20);
		ctx.font = "24px Minecraft";
		ctx.textAlign = "left";
		ctx.fillStyle = "#f8f628";
		ctx.fillText(title, 100, 40);
		ctx.fillStyle = "#ffffff";
		ctx.fillText(message, 100, 80);

		const canvasBuffer = canvas.toBuffer();

		const buffer = await this.toExtension(canvasBuffer, extension);

		res.set("Content-Type", `image/${extension}`).send(buffer);
	}

	public async createOverlay(
		res: Response,
		avatar: string,
		overlay: string,
		extension?: string,
	): Promise<void> {
		if (!avatar) throw new BadRequestException("No avatar provided");
		if (!overlay) throw new BadRequestException("No overlay provided");
		if (!overlays.includes(overlay))
			throw new BadRequestException({
				message: "Invalid overlay",
				availableOverlays: overlays,
			});
		if (extension && !extensions.includes(extension))
			throw new BadRequestException({
				message: "Invalid extension",
				availableExtensions: extensions,
			});

		extension = extension ? extension : "png";

		const avatarImage = await loadImage(avatar);
		const overlayImage = await loadImage(
			resolve(
				process.cwd(),
				"src",
				"assets",
				"overlays",
				`${overlay}.png`,
			),
		);

		const canvas = createCanvas(330, 330);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(avatarImage, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

		const canvasBuffer = canvas.toBuffer();

		const buffer = await this.toExtension(canvasBuffer, extension);

		res.set("Content-Type", `image/${extension}`).send(buffer);
	}

	public async createLevelCard(
		res: Response,
		xp: number,
		level: number,
		xpToLevel: number,
		position: number,
		avatarURL: string,
		status: string,
		tag: string,
		color: string,
		extension?: string,
	): Promise<void> {
		if (isNaN(xp)) throw new BadRequestException("Invalid xp");
		if (isNaN(level)) throw new BadRequestException("Invalid level");
		if (isNaN(xpToLevel))
			throw new BadRequestException("Invalid xpToLevel");
		if (isNaN(position)) throw new BadRequestException("Invalid position");
		if (!avatarURL) throw new BadRequestException("No avatar provided");
		if (!status) throw new BadRequestException("No status provided");
		if (!tag) throw new BadRequestException("No tag provided");
		if (!color) throw new BadRequestException("No color provided");
		if (!colorRegex.test(color))
			throw new BadRequestException("Invalid color");
		if (extension && !extensions.includes(extension))
			throw new BadRequestException({
				message: "Invalid extension",
				availableExtensions: extensions,
			});

		extension = extension ? extension : "png";

		const avatarImage = await loadImage(avatarURL);
		const percent = Math.floor((100 * xp) / xpToLevel);
		const barWidth = Math.floor((635 * percent) / 100);
		const defaultColor = color ? `#${color}` : "#248f24";

		const canvas = createCanvas(934, 282);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "#23272A";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const borderRadius10 = canvas.height * 0.1;
		ctx.fillStyle = "#16181A";
		ctx.beginPath();
		ctx.moveTo(20 + borderRadius10, 37);
		ctx.lineTo(910 - borderRadius10, 37);
		ctx.quadraticCurveTo(910, 37, 910, 37 + borderRadius10);
		ctx.lineTo(910, 248 - borderRadius10);
		ctx.quadraticCurveTo(910, 248, 910 - borderRadius10, 248);
		ctx.lineTo(20 + borderRadius10, 248);
		ctx.quadraticCurveTo(20, 248, 20, 248 - borderRadius10);
		ctx.lineTo(20, 37 + borderRadius10);
		ctx.quadraticCurveTo(20, 37, 20 + borderRadius10, 37);
		ctx.closePath();
		ctx.fill();

		const avatarRadius = 80;
		const avatarX = 43 + avatarRadius;
		const avatarY = 63 + avatarRadius;
		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatarImage, 43, 63, 160, 160);
		ctx.restore();

		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000000";
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(185, 195, 20, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.lineWidth = 8;
		ctx.strokeStyle = "#000000";
		ctx.stroke();
		ctx.fillStyle = statusColors[status];

		ctx.fill();

		ctx.fillStyle = "#484b4e";
		ctx.fillRect(256, 179, 635, 34);

		ctx.lineWidth = 2;
		ctx.strokeStyle = "#000000";
		ctx.stroke();

		ctx.fillStyle = defaultColor;
		ctx.fillRect(256, 180, barWidth, 32);

		ctx.fillStyle = "#FEFEFE";
		ctx.font = "24px Sans";
		ctx.textAlign = "start";
		ctx.fillText(tag, 260, 165);

		ctx.textAlign = "right";
		ctx.fillStyle = "#7F8384";
		ctx.fillText("/ " + this.formatNumber(xpToLevel) + " XP", 880, 165);

		const { width } = ctx.measureText(
			"/ " + this.formatNumber(xpToLevel) + " XP",
		);

		ctx.fillStyle = "#FEFEFE";
		ctx.fillText(this.formatNumber(xp), 870 - width, 165);

		ctx.fillStyle = this.invertColor(defaultColor, true);
		ctx.fillText(this.formatNumber(level) + " Level", 640, 205);

		ctx.fillStyle = defaultColor;
		ctx.textAlign = "right";
		ctx.fillText(`Rank: #${this.formatNumber(position)}`, 870, 90);

		const canvasBuffer = canvas.toBuffer();

		const buffer = await this.toExtension(canvasBuffer, extension);

		res.set("Content-Type", `image/${extension}`).send(buffer);
	}
}
