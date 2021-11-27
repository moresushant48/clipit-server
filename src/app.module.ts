import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { CommonModule } from './common/common.module';
import { SessionsModule } from './sessions/sessions.module';
import * as path from 'path';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { CommonService } from './common/common.service';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule,
    ConfigModule.load(path.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}'), {
      path: path.resolve(process.cwd(), 'env', '.env'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JWT_MODULE_OPTIONS),
    UsersModule,
    CommonModule,
    SessionsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CommonService
  ],
  exports: [
    CommonService
  ]
})
export class AppModule { }
