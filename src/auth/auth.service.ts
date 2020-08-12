import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Common } from '../common';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private common: Common,
  ) {}

  private _hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  private async _updateToken(id: number, token: string) {
    const update = await this.usersRepository.update(id, { token: token });
    return update.affected > 0;
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: payload.username },
    });
    if (user.token.length == 0) return null;
    return user;
  }

  async login(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ username: username });
    if (
      user?.username == username &&
      bcrypt.compareSync(password, user.password)
    ) {
      const payload = { username: user.username, sub: user.id };
      const token = this.jwtService.sign(payload);
      await this._updateToken(user.id, token);
      return await this.usersRepository.findOne({ where: { id: user.id } });
    }
    return null;
  }

  async logout(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username: username },
    });
    return await this._updateToken(user.id, '');
  }

  async register(user: User) {
    const checkEmail = await this.usersRepository.find({
      where: { email: user.email },
    });
    if (checkEmail.length > 0) {
      throw new ConflictException(
        this.common.resErrors([
          { property: 'email', message: 'Email already exists.' },
        ]),
      );
    }
    const checkUsername = await this.usersRepository.find({
      where: { username: user.username },
    });
    if (checkUsername.length > 0) {
      throw new ConflictException(
        this.common.resErrors([
          { property: 'username', message: 'Username already exists.' },
        ]),
      );
    }
    const hash = this._hashPassword(user.password);
    user.password = hash;
    return this.usersRepository.save(user);
  }
}
