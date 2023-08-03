import { Module } from "@nestjs/common";
import { AsciiController } from "./controller";
import { AsciiService } from "./service";

@Module({
	controllers: [AsciiController],
	providers: [AsciiService],
})
export class AsciiModule {}
