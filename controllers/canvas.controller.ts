import { Controller, Get, HTTPStatus, type APIRes } from "sidra";

@Controller("/canvas")
export class CanvasController {
    @Get("/ping")
    ping(): APIRes<string> {
        return {
            message: "Ping",
            data: "Pong",
            statusCode: HTTPStatus.OK,
        };
    }
}
