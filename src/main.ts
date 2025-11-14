import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));


  const config = new DocumentBuilder()
    .setTitle('Payroll Management API')
    .setDescription('The payroll API description')
    .setVersion('1.0')
    .addTag('staff') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // This sets up the URL: http://localhost:3000/api-docs
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
