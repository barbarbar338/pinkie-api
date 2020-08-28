import { Controller, Body, Get, Post } from "@nestjs/common";
import { SwearService } from "./swear.service";
import { CheckMessageDto } from "./dto/check-message.dto";
import { APIRes } from "pinkie-api-types";

@Controller("swear")
export class SwearController {
    constructor(private readonly swearService: SwearService) {}

    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    @Get("wordlist")
    returnSwearWordList(): string[] {
        return this.swearService.returnSwearWordList();
    }

    @Get("replylist")
    returnSwearReplyList(): string[] {
        return this.swearService.returnSwearReplyList();
    }

    @Get("randomreply")
    returnRandomSwearReply(): APIRes {
        return this.swearService.returnRandomSwearReply();
    }

    @Post("check")
    checkSwear(@Body() checkMessageDto: CheckMessageDto): APIRes {
        return this.swearService.checkSwear(checkMessageDto);
    }
}
