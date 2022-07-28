import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Stock App')
    .setDescription('The Stock App API description')
    .setVersion('1.0')
    .addTag('stocks')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();
  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmEzMWE3MC1hMzk4LTRkZmMtOWYzZi0xYzMzZTlhMWYxZWYiLCJ1c2VybmFtZSI6InJvaGl0cHJhamFwYXRpIiwiaWF0IjoxNjU5MDA5ODAxLCJleHAiOjE2NTkwMTA3MDF9.A6vQvhoez2_nE3uDAbgEfN_SkaAiJ2IoEWL9i0WNZiE',
        },
      },
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
  await app.listen(process.env.PORT || 8000);
}

bootstrap();
