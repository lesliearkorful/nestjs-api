import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Common } from '../common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, Common],
  controllers: [UsersController]
})
export class UsersModule {}
