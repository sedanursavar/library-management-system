import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - Frontend'in bağlanabilmesi için
  app.enableCors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO'da tanımlı olmayan fazlalık verileri siler
      forbidNonWhitelisted: true, // Tanımsız veri gelirse hata atar
      transform: true, // <--- İŞTE BU EKSİK! (String'leri Number'a çevirir)
      transformOptions: {
        enableImplicitConversion: true, // Tür dönüşümlerini otomatik yapmaya zorlar
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
