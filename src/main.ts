import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
dotenv.config();

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
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmEzMWE3MC1hMzk4LTRkZmMtOWYzZi0xYzMzZTlhMWYxZWYiLCJ1c2VybmFtZSI6InJvaGl0cHJhamFwYXRpIiwiaWF0IjoxNjU5NTI5NDU5LCJleHAiOjE2NjA0Mjk0NTl9.dHhHHlM0palDC0dAbTWcYozqTP-q_vEZWmVUTdZa66s',
        },
      },
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
  await app.listen(3000, ()=> {
    console.log('Listening on port 3000');
  });
}

bootstrap();
