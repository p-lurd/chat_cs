import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WinstonLogger } from './utilities/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new WinstonLogger());
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors({ origin: '*' });  // Enable CORS globally; replace '*' with your frontend URL
  await app.listen(3000);
}
bootstrap();

