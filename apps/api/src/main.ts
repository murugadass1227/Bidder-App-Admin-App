import "./load-env";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import helmet from "helmet";
import { env } from "./config/env.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  app.use(helmet());
  app.enableCors({
    origin: env.CORS_ORIGINS.split(",").map((o) => o.trim()),
    credentials: true,
  });

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties without validation decorators
      forbidNonWhitelisted: false, // allow extra properties so register (fullName, mobile, compliance) works after frontend updates
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const port = env.PORT;
  await app.listen(port);
  logger.log(`API listening on http://localhost:${port}/api/v1`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
