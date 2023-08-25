import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { ExcpetionsInterceptor } from 'application/exception';
import { ValidationPipe } from 'application/validation';
import { Repository } from 'typeorm';

export async function cleanAll<unkown>(entities: Repository<unknown>[]) {
  for (const entity of entities) {
    const tableName = entity.metadata.tableName;
    await entity.manager.query(`TRUNCATE ${tableName} RESTART IDENTITY CASCADE;`);
  }
}

export async function moduleInit(module?: TestingModule): Promise<INestApplication> {
  if (!module) {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  }

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ExcpetionsInterceptor());
  await app.init();

  return app;
}