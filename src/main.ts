import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from 'app.module';
import { ExcpetionsInterceptor } from 'application/exception';
import { ValidationPipe } from 'application/validation';
import config from 'common/config';
import { log } from 'console';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: config.debug }));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ExcpetionsInterceptor());
  app.use(passport.initialize());
  await app.listen(config.port, '0.0.0.0');
  log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
