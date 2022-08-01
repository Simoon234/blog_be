import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from 'helmet';
import * as cookie from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true
    })
  app.useGlobalPipes(
    new ValidationPipe({
        transform: true,
        disableErrorMessages: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));

    app.use(cookie());
    app.use(helmet({
        crossOriginResourcePolicy: false,
    }))
    await app.listen(3100);
}

bootstrap();
