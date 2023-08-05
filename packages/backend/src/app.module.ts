import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { resolve } from "path";
import { AppController } from "./app.controller";
import { AuthGuard } from "./guards/auth.guard";
import { RatelimitGuard } from "./guards/ratelimit.guard";
import { AsciiModule } from "./modules/ascii/module";
import { CanvasModule } from "./modules/canvas/module";
import { SwearModule } from "./modules/swear/module";
import { RatelimitUtil } from "./utils/ratelimit";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: resolve(process.cwd(), "src", "public"),
		}),
		AsciiModule,
		SwearModule,
		CanvasModule,
	],
	controllers: [AppController],
	providers: [
		RatelimitUtil,
		{ provide: APP_GUARD, useClass: AuthGuard },
		{ provide: APP_GUARD, useClass: RatelimitGuard },
	],
})
export class AppModule {}
