import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { CommonService } from 'src/common/common.service';
import { Request, Response } from 'express';
import { Public } from 'src/decorator/public.decorator';

@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService, private readonly commonService: CommonService) {
  }

  @Public()
  @Post('add')
  async addUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const data = await this.service.addUser(req.body);

      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.warn("Users -> add : ", error);
    }
  }

  @Public()
  @Post('verify')
  async verifyUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const data = await this.service.verifyUser(req.body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.warn("Users -> Verify : ", error);
    }
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const data = await this.service.me(req.user);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.warn("Users -> me : ", error);
    }
  }

}
