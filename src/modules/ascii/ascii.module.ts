import { Module } from "@nestjs/common";
import { AsciiController } from "./ascii.controller";
import { AsciiService } from "./ascii.service";

@Module({
	controllers: [AsciiController],
	providers: [AsciiService],
})
export class AsciiModule {}
