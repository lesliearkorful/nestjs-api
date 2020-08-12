import { Controller, Get, Query } from '@nestjs/common';
import { Common } from '../common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly common: Common,
  ) {}

  @Get('users')
  async login(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    const result = await this.service.paginate({
      page,
      limit,
    });
    return this.common.resListData(result);
  }

  // @Delete('users')
  // async deleteAllUsers() {
  //   return await this.service.deleteAllUsers();
  // }
}
