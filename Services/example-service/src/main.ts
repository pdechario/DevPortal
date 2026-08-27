import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  console.log(`example-service listening on http://localhost:${port}`);
}

void bootstrap();
