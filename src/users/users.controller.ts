import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
  Post,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Common } from '../common';
import { JwtAuthGuard } from 'src/auth/auth.jwt-auth.guard';
import { CreateUserDto } from './createUserDto.dto';

@Controller()
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly common: Common,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async myProfile(@Request() req) {
    const user = await this.service.findOne({ username: req.user.username });
    return this.common.resData(user);
  }

  @HttpCode(202)
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async updateProfile(@Request() req, @Body() body: CreateUserDto) {
    const form = await this.service.findOne({ username: req.user.username });
    form.email = body.email;
    form.fullname = body.fullname;
    form.phone = body.phone;
    form.bio = body.bio;
    form.website = body.website;
    if (await this.service.updateUser(form)) {
      const updatedUser = await this.service.findOne({
        username: req.user.username,
      });
      return this.common.resData(updatedUser);
    } else {
      throw new BadRequestException(
        this.common.resErrors([
          {
            property: 'profile',
            message: 'The changes were not saved',
          },
        ]),
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:username')
  async profile(@Param('username') params: string) {
    const user = await this.service.findOne({ username: params });
    if (user == null) {
      throw new NotFoundException(
        this.common.resErrors([
          { property: 'profile', message: 'User does not exist' },
        ]),
      );
    }
    return this.common.resData(user);
  }
}
