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
}
