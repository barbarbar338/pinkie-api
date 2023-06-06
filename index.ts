import {
    Controller,
    Get,
    HTTPStatus,
    Handle,
    Redirect,
    type IRedirectRes,
} from "sidra";
import { CanvasController } from "./controllers/canvas.controller";
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

export const handler = Handle([
    CanvasController,
    PingController,
    AppController,
]);
