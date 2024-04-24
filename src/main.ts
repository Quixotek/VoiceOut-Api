import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NODE_ENV, PORT } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('VOICEOUT');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);

  logger.log(
    `Server running on http://localhost:${PORT}/graphql at ${NODE_ENV?.toUpperCase()} environment`,
  );
}

try {
  bootstrap();
} catch (error) {
  console.log(error);
}
