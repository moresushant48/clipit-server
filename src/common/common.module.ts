import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from 'src/constants';

@Module({
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
  imports: [JwtModule.register(JWT_MODULE_OPTIONS)]
})
export class CommonModule { }
