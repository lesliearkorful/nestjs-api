import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

const dbURL =
  process.env.DATABASE_URL ||
  'postgres://lesliearkorful:password@localhost:5423/postgres';
const chunks = dbURL.split(':');
const [port, databaseName] = chunks[3].split('/');
const [password, host] = chunks[2].split('@');
const username = chunks[1].split('//')[1];
const rootConfig = {
  type: 'postgres',
  port: 5432 || port,
  host: host || 'localhost',
  database: databaseName || 'postgres',
  username: username || 'lesliearkorful',
  password: password || 'password',
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
};

// console.log(rootConfig);

@Module({
  imports: [
    TypeOrmModule.forRoot(rootConfig as TypeOrmModule),
    UsersModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
