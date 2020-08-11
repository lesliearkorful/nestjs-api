import { BadRequestException, Body, Controller, Get, Post, UnauthorizedException, Request, UseGuards } from '@nestjs/common';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { Common } from '../common';
import { CreateUserDto } from '../users/createUserDto.dto';
import { JwtAuthGuard } from './auth.jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private common: Common) { }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req) {
    const status = await this.authService.logout(req.user.username);
    return this.common.resData({ "logout": status });
  }

  @Post('login')
  async login(@Body() req: CreateUserDto) {
    const user = await this.authService.login(req.username, req.password);
    if (user == null) throw new UnauthorizedException("User credentials are incorrect.");
    else return this.common.resData({
      token: user.token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user
    });
  }

  @Post('register')
  async register(@Body() req: CreateUserDto) {
    const form = new User();
    form.username = req.username;
    form.email = req.email;
    form.fullname = req.fullname;
    form.password = req.password;
    form.bio = req.bio;
    form.phone = req.phone;
    form.website = req.website;
    const errors = form.validate();
    if (errors.length > 0) return this.common.resErrors(errors);
    const user = await this.authService.register(form);
    if (user == null) throw new BadRequestException();
    else return user;
  }
}
