import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {

  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    private readonly commonService: CommonService) {
    super(userRepository);
  }

  async createAccessToken(user: User, uuid?: any): Promise<any> {
    var uuid_new;
    if (!uuid) {
      uuid_new = uuidv4();

      const sessions = {
        userId: user.id,
        UUID: uuid_new,
        active: true,
      }
      const entity = Object.assign(new User(), sessions);
    } else {
      uuid_new = uuid;
    }
    const payload = {
      id: user.id,
      uuid: uuid_new,
      timestamp: Date.now().toString()
    };
    const jtoken = this.commonService.jwtSignup(payload);
    return jtoken;
  }

  async me(decodedUser: any): Promise<any> {
    const response = { user: null, flash: false, message: 'Invalid request.', responseCode: 400 };
    const data = decodedUser;
    try {
      const user = await this.repo.findOne({ where: { id: data.id } })
      if (user) {
        response.user = user;
        response.flash = true;
        response.message = "User Verified";
        response.responseCode = 200;
        return response;
      } else {
        response.message = "Couldn't Verify";
        response.responseCode = 401;
        return response;
      }

    } catch (error) {
      response.message = "Failed to check.";
      response.responseCode = 400;
      return response;
    }
    return response;
  }

  async addUser(user: User): Promise<any> {
    const response = { user: null, flash: false, message: 'Invalid request.', responseCode: 400 };

    try {
      // check if user exists. if YES -> response 300.
      if (await this.repo.findOne({ where: { email: user.email } })) {
        response.message = 'User already exists.';
        response.responseCode = 300;
        return response;
      }
      //else
      user.password = await this.commonService.getHash(user.password);
      response.user = await this.repo.save(user);
      const accessToken = await this.createAccessToken(response.user);
      response.user.accessToken = accessToken;
      response.flash = true;
      response.message = "User Added";
      response.responseCode = 200;
    } catch (error) {
      console.log(error);
      response.message = 'Failed to save';
      response.responseCode = 400;
    }
    return response;
  }



  async verifyUser(params: any) {
    const response = { user: null, flash: false, message: 'Invalid request.', responseCode: 400 };

    try {
      const user = await this.repo.findOne({ where: { email: params.email } });
      console.warn(user);
      if (user && params.password != null) {
        if (!user.enabled) {
          return new ForbiddenException('Forbidden Access');
        }

        let status = await this.commonService.compareHash(params.password, user.password);
        if (status) {
          response.user = user;
          response.flash = true;
          response.message = "Login Successful."
          response.responseCode = 200;
          response.user.accessToken = await this.createAccessToken(user, params.uuid);
          return response;
        } else {
          response.user = null;
          response.flash = false;
          response.responseCode = 401;
          response.message = "Invalid Credentials.";
          return response;
        }
      } else {
        response.responseCode = 401;
        response.message = "Invalid Credentials."
        return response;
      }
    } catch (error) {
      console.error(error);
    }
    return response;
  }
}
