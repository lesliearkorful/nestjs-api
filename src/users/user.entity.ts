import { Exclude } from 'class-transformer';
import { IsEmail, isEmail, isEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Common } from '../common';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude({ toPlainOnly: true })
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  fullname: string;

  @Column()
  phone: string;

  @Column()
  website: string;

  @Column()
  bio: string;

  @Column({ default: true })
  @Exclude()
  isActive: boolean;

  @Column({ default: '' })
  @Exclude({ toPlainOnly: true })
  token: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  validate(): Map<string, string>[] {
    const errors = [];
    const common = new Common();
    if (!isEmail(this.email)) errors.push(common.errorMessage("email", "Email is not valid"));
    if (isEmpty(this.username)) errors.push(common.errorMessage("username", "Username is required"));
    if (isEmpty(this.fullname)) errors.push(common.errorMessage("fullname", "Fullname is required"));
    if (isEmpty(this.password)) errors.push(common.errorMessage("password", "Password is required"));
    return errors;
  }

  copyWith(other: User): User {
    const result = new User();
    result.id = this.id;
    result.isActive = this.isActive;
    result.password = this.password;
    result.bio = other.bio ?? this.bio;
    result.email = other.email ?? this.email;
    result.fullname = other.fullname ?? this.fullname;
    result.phone = other.phone ?? this.phone;
    result.token = other.token ?? this.token;
    result.username = other.username ?? this.username;
    result.website = other.website ?? this.website;
    return result;
  }
}
