import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser());
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: 'http://localhost:3000', // Ваш фронтенд URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Якщо ви хочете використовувати кукі
  });
  await app.listen(3333)
}
bootstrap()
