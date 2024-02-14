import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as moment from 'moment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  moment.locale('es');
  app.enableCors();
  app.setGlobalPrefix('api')
  await app.listen(3005);
}
bootstrap();
