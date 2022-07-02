import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentValidator } from './config/environment.validator';
import { DatabaseConfig } from './config/database.config';
import { AppConfig } from './config/app.config';
import { DatabaseConfigInterface } from './config/interfaces/database.config.interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateWordModule } from './validate-word/validate-word.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationSchema: EnvironmentValidator.validate(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const database: DatabaseConfigInterface =
          configService.get<DatabaseConfigInterface>('database');
        return {
          type: database.type,
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          entities: ['dist/**/**.entity{.ts,.js}'],
          synchronize: false,
          dateStrings: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      inject: [ConfigService],
    }),
    ValidateWordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
