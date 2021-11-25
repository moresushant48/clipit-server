import { Injectable, Req } from '@nestjs/common';
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

  async addUser(user: User): Promise<any> {
    const response = { user: null, flash: false, message: 'Invalid request.', responseCode: 400 };

    try {
      // check if user exists. if YES -> response 300.
      console.log(await this.repo.findOne({ where: [{ email: user.email }] }));
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
}
