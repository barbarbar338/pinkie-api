import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { RateLimiterGuard, RateLimiterModule } from "nestjs-rate-limit";
import { resolve } from "path";
import { AppController } from "./app.controller";
import { AsciiModule } from "./modules/ascii/module";
import { CanvasModule } from "./modules/canvas/module";
import { SwearModule } from "./modules/swear/module";

@Module({
	imports: [
		RateLimiterModule.forRoot({
			points: 100,
			duration: 5,
			keyPrefix: "global",
		}),
		ServeStaticModule.forRoot({
			rootPath: resolve(process.cwd(), "src", "public"),
		}),
		AsciiModule,
		SwearModule,
		CanvasModule,
	],
	controllers: [AppController],
	providers: [{ provide: APP_GUARD, useClass: RateLimiterGuard }],
})
export class AppModule {}
