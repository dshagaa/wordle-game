import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigInterface } from './config/interfaces/app.config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const validationErrors = {
          error: 'validation_error',
          errors: {},
          message: 'The given data was invalid',
        };
        errors.forEach((error) => {
          validationErrors.errors[error.property] = Object.values(
            error.constraints,
          );
        });
        return new UnprocessableEntityException(validationErrors);
      },
      transform: true,
    }),
  );
  const config = app.get(ConfigService);
  const appConf = config.get<AppConfigInterface>('app');
  await app.listen(appConf.port);
  const url = await app.getUrl();
  Logger.verbose(`Service listen on: ${url}`);
}

bootstrap();
