import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionsService extends TypeOrmCrudService<Session> {
  constructor(
    @InjectRepository(Session) sessionRepository: Repository<Session>
  ) {
    super(sessionRepository);
  }

  async generateSessionId(decodedUser: any): Promise<any> {
    const response = { session: null, flash: false, message: 'Invalid request.', responseCode: 400 };
    try {
      var newSession = new Session()
      newSession.sessionId = uuidv4();
      // newSession.userID = decodedUser.id;
      const data = await this.repo.save(newSession);
      if (data) {
        response.session = data;
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

  async watchSessionId(sessionId: string) {
    const response = { session: null, flash: false, message: 'Invalid request.', responseCode: 400 };
    try {
      const data = await this.repo.findOne({ where: { sessionId: sessionId } });
      if (data) {
        response.session = data;
        response.flash = true;
        response.message = "Session found.";
        response.responseCode = 200;
        return response;
      } else {
        response.message = "Session not found.";
        response.responseCode = 300;
        return response;
      }
    } catch (error) {
      response.flash = true;
      response.message = "Unable to retrieve session.";
      response.responseCode = 400;
      return response;
    }


  }

  async setSessionUser(decodedUser: any, params: any) {
    const response = { session: null, flash: false, message: 'Invalid request.', responseCode: 400 };
    try {
      console.warn('session : ', params.sessionId, ' user : ', decodedUser.id);
      const data = await this.repo.findOne({ where: { sessionId: params.sessionId } });
      console.warn('session : ', params.sessionId, ' user : ', decodedUser.id);
      if (data) {
        data.userID = decodedUser.id;
        const done = await this.repo.update(data.id, data);

        if (done) {
          response.session = data;
          response.flash = true;
          response.message = "User Id updated.";
          response.responseCode = 200;
          return response;
        } else {
          response.message = "Couldn't update user id.";
          response.responseCode = 300;
          return response;
        }
      } else {
        response.message = "Couldn't find session.";
        response.responseCode = 403;
        return response;
      }
    } catch (error) {
      console.error(error);
      response.flash = true;
      response.message = "Unable to retrieve session.";
      response.responseCode = 400;
      return response;
    }


  }

}
