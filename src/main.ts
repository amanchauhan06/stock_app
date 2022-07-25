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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 8000, function () {
    console.log(
      'Express server listening on port %d in %s mode',
      this.address().port,
      app.get('env'),
    );
  });
}

bootstrap();
