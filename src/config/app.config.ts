import { registerAs } from '@nestjs/config';
import { get } from 'lodash';

const AppConfig = registerAs('app', () => ({
  environment: get(process, ['env', 'APP_NODE_ENV'], null),
  host: get(process, ['env', 'APP_HOST'], null),
  port: get(process, ['env', 'APP_PORT'], null),
}));

export { AppConfig };
