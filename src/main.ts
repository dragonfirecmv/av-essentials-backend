import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import * as Express from 'express'
import { ExpressAdapter } from '@nestjs/platform-express';

const port = process.env.PORT || 8080

const server = Express()

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server)
  );
  app.enableCors();
  await app.listen(port)
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap')
}
bootstrap();
