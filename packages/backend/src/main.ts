import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CONFIG } from "./config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: "*",
		methods: "GET,POST",
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	await app.listen(CONFIG.PORT, () => {
		console.log(`Listening on port ${CONFIG.PORT}`);
	});
}
bootstrap();
