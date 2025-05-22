import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RolesGuard } from './common/decorators/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
   app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = new DocumentBuilder()
    .setTitle('Tele Doctor')
    .setDescription('The Tele Doctor API description')
    .setVersion('0.1')
    .addServer('api/v1')
    .addBearerAuth()
    .build();

  (BigInt.prototype as any).toJSON = function () {
    return Number(this);
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  const port = process.env.PORT || 8080;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();

/**
 * Added to test workflow
 */
