import { Controller, Get, Render } from "@nestjs/common";
import { APIRes } from "pinkie-api-types";

@Controller("docs")
export class DocsController {
    @Get("/ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    @Get()
    @Render("index.handlebars")
    returnIndex(): void {}

    @Get("ascii")
    @Render("ascii.handlebars")
    returnAscii(): void {}

    @Get("canvas")
    @Render("canvas.handlebars")
    returnCanvas(): void {}

    @Get("swear")
    @Render("swear.handlebars")
    returnSwear(): void {}
}
