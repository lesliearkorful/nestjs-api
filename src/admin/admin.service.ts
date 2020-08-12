import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options);
  }

  async allUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async deleteAllUsers() {
    return this.usersRepository.clear();
  }
}
