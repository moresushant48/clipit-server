import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Crud, CrudController } from '@nestjsx/crud';
import { Session } from './entities/session.entity';
import { Request, Response } from 'express';
import { Public } from 'src/decorator/public.decorator';

@Crud({
  model: {
    type: Session,
  },
})
@Controller('sessions')
export class SessionsController implements CrudController<Session> {
  constructor(public service: SessionsService) { }

  @Public()
  @Get('create')
  async createSession(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.service.generateSessionId();
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.warn("Sessions -> create : ", error);
    }
  }
}
