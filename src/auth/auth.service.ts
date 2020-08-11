import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  private async _updateToken(id: number, token: string) {
    const update = await this.usersRepository.update(id, { token: token });
    return update.affected > 0;
  }

  async validateUser(payload: any): Promise<User> {
    const user =  await this.usersRepository.findOne({ where: { username: payload.username } });
    if (user.token.length == 0) return null;
    return user;
  }

  async login(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ username: username, password: password });
    if (user?.username == username && user?.password == password) {
      const payload = { username: user.username, sub: user.id };
      const token = this.jwtService.sign(payload);
      await this._updateToken(user.id, token);
      return await this.usersRepository.findOne({ where: { id: user.id } });
    }
    return null;
  }

  async logout(username: string) {
    const user = await this.usersRepository.findOne({ where: { username: username } });
    return await this._updateToken(user.id, "");
  }

  async register(user: User) {
    const checkEmail = await this.usersRepository.find({ where: { email: user.email } });
    if (checkEmail.length > 0) throw new ConflictException("Email already exists");
    const checkUsername = await this.usersRepository.find({ where: { username: user.username } });
    if (checkUsername.length > 0) throw new ConflictException("Username already exists");
    return this.usersRepository.save(user);
  }
}
