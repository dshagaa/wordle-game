import { registerAs } from '@nestjs/config';
import { get } from 'lodash';

const DatabaseConfig = registerAs('database', () => ({
  type: get(process, ['env', 'DB_TYPE'], null),
  host: get(process, ['env', 'DB_HOST'], null),
  port: get(process, ['env', 'DB_PORT'], null),
  username: get(process, ['env', 'DB_USERNAME'], null),
  password: get(process, ['env', 'DB_PASSWORD'], null),
  database: get(process, ['env', 'DB_NAME'], null),
}));

export { DatabaseConfig };
