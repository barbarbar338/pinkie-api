import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { SequelizeModule } from "@nestjs/sequelize";
import { ServeStaticModule } from "@nestjs/serve-static";
import { resolve } from "path";
import { AppController } from "./app.controller";
import { AuthGuard } from "./guards/auth";
import { RatelimitGuard } from "./guards/ratelimit";
import { User } from "./models/user";
import { AsciiModule } from "./modules/ascii/module";
import { AuthModule } from "./modules/auth/module";
import { CanvasModule } from "./modules/canvas/module";
import { SwearModule } from "./modules/swear/module";
import { RatelimitUtil } from "./utils/ratelimit";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: resolve(process.cwd(), "src", "public"),
		}),
		SequelizeModule.forRoot({
			dialect: "sqlite",
			storage: resolve(process.cwd(), "database.sqlite"),
			models: [User],
		}),
		AsciiModule,
		SwearModule,
		CanvasModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		RatelimitUtil,
		{ provide: APP_GUARD, useClass: AuthGuard },
		{ provide: APP_GUARD, useClass: RatelimitGuard },
	],
})
export class AppModule {}
