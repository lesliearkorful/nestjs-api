import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async allUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async deleteAllUsers() {
    return this.usersRepository.clear();
  }
}
