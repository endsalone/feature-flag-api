import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'common/config';

const dbProvider: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  logging: config.debug ? 'all' : false,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  autoLoadEntities: true,
  synchronize: config.env === 'test' ? true : false,
  logger: config.env === 'test' ? 'advanced-console' : 'simple-console',
  migrationsRun: true
};

export default dbProvider;
