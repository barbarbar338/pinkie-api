import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AsciiModule } from "src/routers/ascii/ascii.module";
import { CanvasModule } from "src/routers/canvas/canvas.module";
import { DocsModule } from "src/routers/docs/docs.module";
import { SwearModule } from "src/routers/swear/swear.module";
import { AppController } from "./app.controller";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limit";

@Module({
    imports: [
        RateLimiterModule.forRoot({
            points: 100,
            duration: 5,
            keyPrefix: "global",
        }),
        AsciiModule,
        CanvasModule,
        DocsModule,
        SwearModule,
    ],
    controllers: [AppController],
    providers: [{ provide: APP_GUARD, useClass: RateLimiterGuard }],
})
export class AppModule {}
