import { Controller, Get, Redirect } from "@nestjs/common";
import { APIRes } from "pinkie-api-types";

@Controller()
export class AppController {
    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    @Get("check")
    checkVersion(): APIRes {
        return {
            version: "2.1.0",
            latestKey: "disguised-shake",
        };
    }

    @Get()
    @Redirect("/docs", 302)
    redirectToDocs(): void {}
}
