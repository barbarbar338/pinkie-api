import { Module } from "@nestjs/common";
import { SwearController } from "./swear.controller";
import { SwearService } from "./swear.service";

@Module({
    controllers: [SwearController],
    providers: [SwearService],
})
export class SwearModule {}
