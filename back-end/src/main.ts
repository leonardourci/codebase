import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('Define Your API Title')
    .setDescription('API description goes here')
    .addTag('Define your tag here')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Include the returned token from sign-up prefixed with Bearer',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'BearerAuth',
    )
    .addSecurityRequirements('BearerAuth')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      // Automatically transform payloads to be objects typed according to their DTO classes
      transform: true,

      // Remove properties not defined in the DTOs
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
