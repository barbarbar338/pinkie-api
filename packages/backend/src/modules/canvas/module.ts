import { Module } from "@nestjs/common";
import { CanvasController } from "./controller";
import { CanvasService } from "./service";

@Module({
	controllers: [CanvasController],
	providers: [CanvasService],
})
export class CanvasModule {}
