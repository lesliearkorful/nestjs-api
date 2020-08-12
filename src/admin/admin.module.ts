import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Common } from '../common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminService, Common],
  controllers: [AdminController],
})
export class AdminModule {}
