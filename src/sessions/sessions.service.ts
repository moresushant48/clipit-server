import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { v4 as uuidv4 } from 'uuid';
import { session } from 'passport';

@Injectable()
export class SessionsService extends TypeOrmCrudService<Session> {
  constructor(
    @InjectRepository(Session) sessionRepository: Repository<Session>
  ) {
    super(sessionRepository);
  }

  async generateSessionId(): Promise<any> {
    const response = { sessionId: null, flash: false, message: 'Invalid request.', responseCode: 400 };
    try {
      var newSession = new Session()
      newSession.sessionId = uuidv4();
      const data = this.repo.save(newSession);
      if (data) {
        response.sessionId = newSession.sessionId;
        response.flash = true;
        response.message = 'New Session Created';
        response.responseCode = 200;
      } else {
        response.message = 'Failed to Create';
        response.responseCode = 401;
      }

    } catch (error) {
      response.message = 'Failed to Save';
      response.responseCode = 400;
      console.warn("Sessions -> create -> generateSessionId : ", error);
    }
    return response;
  }

}
