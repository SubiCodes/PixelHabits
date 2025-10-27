import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend access
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001', // Your frontend URL
    credentials: true, // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Enable global exception filter for consistent error responses
  app.useGlobalFilters(new PrismaExceptionFilter(), new HttpExceptionFilter());
  
  // Enable strict validation with transformation for multipart/form-data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if extra properties are sent
      transform: true, // Transform to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow string -> boolean conversion
      },
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
