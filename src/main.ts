import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import *  as bodyParser from 'body-parser';
import { RequestContextMiddleware } from './middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(RequestContextMiddleware);
  await app.listen(3020);
}
bootstrap();
