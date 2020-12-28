import { Controller, Body, Post, Get, Query } from "@nestjs/common";
import { AsciiService } from "./ascii.service";
import { ConvertDto } from "./dto/convert.dto";
import { APIRes } from "pinkie-api-types";
import config from "src/config";

@Controller(config.API_VERSION + "/ascii")
export class AsciiController {
    constructor(private readonly asciiService: AsciiService) {}

    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    @Get()
    convertMessageFromQuery(@Query() convertDto: ConvertDto): APIRes {
        return this.asciiService.convertMessage(convertDto);
    }

    @Post()
    convertMessage(@Body() convertDto: ConvertDto): APIRes {
        return this.asciiService.convertMessage(convertDto);
    }
}
