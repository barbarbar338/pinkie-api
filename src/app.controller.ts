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
    getOffsets(): APIRes {
        return {
            version: "2.0.0",
            latestKey: "spicy-donut",
        };
    }

    @Get()
    @Redirect("/docs", 302)
    redirectToDocs(): void {}
}
