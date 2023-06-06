import {
    Controller,
    Get,
    HTTPStatus,
    Handle,
    Redirect,
    type IRedirectRes,
} from "sidra";
import { PingController } from "./controllers/ping.controller";

@Controller()
class AppController {
    @Redirect()
    @Get()
    redirectToRepo(): IRedirectRes {
        return {
            statusCode: HTTPStatus.MOVED_PERMANENTLY,
            to: "https://github.com/barbarbar338/pinkie-api",
        };
    }
}

export const handler = Handle([PingController, AppController]);
