import { Controller, Get, Render } from "@nestjs/common";
import { APIRes } from "pinkie-api-types";

@Controller("docs")
export class DocsController {

    @Get()
    @Render("index.handlebars")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }
}
