import { Module } from "@nestjs/common";
import { TsxViewsModule } from "nestjs-tsx-views";
import { resolve } from "path";
import { DocsController } from "./controller";
import { DocsService } from "./service";

@Module({
	imports: [
		TsxViewsModule.register({
			viewsDirectory: resolve(__dirname, "views"),
			forRoutes: [DocsController],
		}),
	],
	controllers: [DocsController],
	providers: [DocsService],
})
export class DocsModule {}
