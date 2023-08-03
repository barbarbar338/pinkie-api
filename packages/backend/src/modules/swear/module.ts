import { Module } from "@nestjs/common";
import { SwearController } from "./controller";
import { SwearService } from "./service";

@Module({
	controllers: [SwearController],
	providers: [SwearService],
})
export class SwearModule {}
