import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { CommonService } from 'src/common/common.service';
import { Response } from 'express';

@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService, private readonly commonService: CommonService) {
  }

  @Post('add')
  async addUser(@Req() req, @Res() res: Response): Promise<any> {
    try {
      const data = await this.service.addUser(req.body);

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {

    }
  }

  @Post('verify')
  async verifyUser(@Req() req, @Res() res: Response): Promise<any> {
    try {
      const data = await this.service.addUser(req.body);

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {

    }
  }

}
