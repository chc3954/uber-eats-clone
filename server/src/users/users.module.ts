import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verification';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UserService, UsersResolver],
  exports: [UserService],
})
export class UsersModule {}
