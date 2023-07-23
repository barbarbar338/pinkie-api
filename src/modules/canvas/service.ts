import { BadRequestException, Injectable } from "@nestjs/common";
import { Canvas, createCanvas, loadImage, registerFont } from "canvas";
import { Response } from "express";
import { readdirSync } from "fs";
import { resolve } from "path";

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
const extensions = ["png", "jpeg", "webp"];
const overlays = readdirSync(
	resolve(process.cwd(), "src", "assets", "overlays"),
).map((file) => file.split(".")[0]);
const icons = readdirSync(
	resolve(process.cwd(), "src", "assets", "minecraft_item_icons"),
).map((file) => file.split(".")[0]);

@Injectable()
export class CanvasService {
	// TODO: sharp causes some errors on windows, so it's disabled for now
	private async toExtension(buffer: Buffer, extension: string) {
		if (process.platform == "win32") return buffer;
		else {
			const { default: sharp } = await import("sharp");
			return await sharp(buffer)
				[extension]({
					quality: 70,
				})
				.toBuffer();
		}
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

		if (extension && !extensions.includes(extension))
			throw new BadRequestException({
				message: "Invalid extension",
				availableExtensions: extensions,
			});

		if (!icons.includes(icon))
			throw new BadRequestException({
				message: "Invalid icon",
				availableIcons: icons,
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

		if (extension && !extensions.includes(extension))
			throw new BadRequestException({
				message: "Invalid extension",
				availableExtensions: extensions,
			});

		if (!overlays.includes(overlay))
			throw new BadRequestException({
				message: "Invalid overlay",
				availableOverlays: overlays,
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
}
