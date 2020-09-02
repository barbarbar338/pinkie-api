import { NestFactory } from "@nestjs/core";
import helmet from "fastify-helmet";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import config from "./config";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import { ValidationPipe } from "@nestjs/common";
import handlebars from "handlebars";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );
    app.register(helmet);
    app.enableCors();
    app.use(morgan("dev"));
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    /*
        Global prefix (example.com/v2) için aşağıdaki yöntem oldukça yararlı 
        Ancak biz index sayfamızda da işlem yapmak istiyoruz
        API kaynaklarını bir görüntü motoru ile index sayfamızda göstermemiz lazım
        Bu yüzden global prefixi bu şekilde hızlıca ayarlama yerine manuel olarak ayarlayacağım
        
        Kısacası aşağıdaki 1 satır kodu kaldırıp tüm controllerlara "config.API_VERSION" prefixini eklemem lazım
        Yoksa index sayfamda işlem yapamayacağım

        - app.setGlobalPrefix(config.API_VERSION);
    */

    app.useStaticAssets({
        root: process.cwd() + "/src/public",
        prefix: "/public/",
    });
    app.setViewEngine({
        engine: {
            handlebars: handlebars,
        },
        templates: "src/views",
    });
    await app.listen(config.PORT, "0.0.0.0");
}
bootstrap();
