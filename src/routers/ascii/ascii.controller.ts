import { Controller, Body, Post, Get } from "@nestjs/common";
import { AsciiService } from "./ascii.service";
import { ConvertDto } from "./dto/convert.dto";
import { APIRes } from "pinkie-api-types";

@Controller("ascii")
export class AsciiController {
    constructor(private readonly asciiService: AsciiService) {}

    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    @Post("convert")
    convertMessage(@Body() convertDto: ConvertDto): APIRes {
        return this.asciiService.convertMessage(convertDto);
    }
}
