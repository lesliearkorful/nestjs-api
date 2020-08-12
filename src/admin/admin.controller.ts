import { Controller, Delete, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Common } from '../common';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly common: Common,
  ) {}

  @Get('users')
  async login() {
    const users = await this.service.allUsers();
    return this.common.resData(users);
  }

  // @Delete('users')
  // async deleteAllUsers() {
  //   return await this.service.deleteAllUsers();
  // }
}
