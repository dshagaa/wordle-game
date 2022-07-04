import {
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentValidator } from './config/environment.validator';
import { DatabaseConfig } from './config/database.config';
import { AppConfig } from './config/app.config';
import { DatabaseConfigInterface } from './config/interfaces/database.config.interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateWordModule } from './validate-word/validate-word.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityMiddleware } from './middlewares/security.middleware';
import { ValidateWordController } from './validate-word/validate-word.controller';
import { UsersController } from './users/users.controller';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { LeaderboardController } from './leaderboard/leaderboard.controller';

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
    HttpModule,
    ScheduleModule.forRoot(),
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
    UsersModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(SecurityMiddleware)
      .exclude({ path: 'users', method: RequestMethod.POST })
      .forRoutes(
        UsersController,
        ValidateWordController,
        LeaderboardController,
      );
  }
}
