import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Sse } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Crud, CrudController } from '@nestjsx/crud';
import { Session } from './entities/session.entity';
import { Request, Response } from 'express';
import { Public } from 'src/decorator/public.decorator';
import { interval, map, Observable } from 'rxjs';

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
  async createSession(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const data = await this.service.generateSessionId(req.user);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.warn("Sessions -> create : ", error);
    }
  }

  // @Public()
  @Post('user')
  async setSessionUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const data = await this.service.setSessionUser(req.user, req.body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.warn("Sessions -> setSessionUser : ", error);
    }
  }

  @Public()
  @Sse(':sessionId')
  async sseSession(@Param('sessionId') sessionId: string): Promise<Observable<MessageEvent>> {
    const data = await this.service.watchSessionId(sessionId);
    return interval(1000).pipe(
      map((_) => ({ data: data } as MessageEvent)),
    );
  }
}
