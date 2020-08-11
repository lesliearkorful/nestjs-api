import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(user: User): Promise<boolean> {
    const existing = await this.usersRepository.findOne({ where: { id: user.id } });
    const update = await this.usersRepository.update(user.id, existing.copyWith(user));
    return update.affected > 0;
  }

  async findOne({ email, username, password, token }: { email?: string, username?: string, password?: string, token?: string }): Promise<User> {
    if (email && password) return this.usersRepository.findOne({ where: { email: email, password: password } });
    if (username && password) return this.usersRepository.findOne({ where: { username: username, password: password } });
    if (email) return this.usersRepository.findOne({ where: { email: email } });
    if (username) return this.usersRepository.findOne({ where: { username: username } });
    if (token) return this.usersRepository.findOne({ where: { token: token } });
    return null;
  }

  async remove(username: string): Promise<void> {
    await this.usersRepository.delete(username);
  }
}
