import { Controller, Get, HTTPStatus, type APIRes } from "sidra";

@Controller("/ping")
export class PingController {
    @Get()
    ping(): APIRes<string> {
        return {
            message: "Ping",
            data: "Pong",
            statusCode: HTTPStatus.OK,
        };
    }
}
