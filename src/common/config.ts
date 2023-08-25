import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'db',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME || 'feature_flag',
    password: process.env.DATABASE_PASSWORD || 'feature_flag',
    database: process.env.DATABASE_NAME || 'feature_flag',
    url: process.env.DATABASE_URL ?? 'postgresql://feature_flag:feature_flag@db:5432/feature_flag'
  },
  debug: Boolean(process.env.DEBUG) === true,
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    salt: Number(process.env.JWT_SALT) || 10
  }
};
