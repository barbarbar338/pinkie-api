import { BadRequestException, Injectable } from "@nestjs/common";
import { createCanvas } from "canvas";
import { Response } from "express";
import sharp from "sharp";

const colorRegex = /^([0-9a-f]{3}){1,2}$/i;
const extensions = ["png", "jpeg", "webp"];

@Injectable()
export class CanvasService {
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

		const buffer = await sharp(canvasBuffer)
			[extension]({
				quality: 70,
			})
			.toBuffer();

		res.set("Content-Type", `image/${extension}`).send(canvasBuffer);
	}
}
