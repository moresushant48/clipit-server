import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { CommonModule } from './common/common.module';
import * as path from 'path';

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
    UsersModule,
    CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
