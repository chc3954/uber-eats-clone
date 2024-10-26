import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<{ ok: boolean; error?: string }> {
    const { email, password, role } = createAccountInput;
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(this.verifications.create({ user }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Could not create account.' };
    }
  }

  async login(
    loginInput: LoginInput,
  ): Promise<{ ok: boolean; error?: string; token?: string }> {
    const { email, password } = loginInput;
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['password'],
      });
      if (!user) {
        return { ok: false, error: 'Incorrect email' };
      }
      const passwordCorrect = await user.checkPassword(user.password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Incorrect password' };
      }
      const token = this.jwtService.sign(user.id);
      console.log(token);
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(userId: number, { email, password }: EditProfileInput) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        console.log(verification.user);
        this.users.save(verification.user);
        return true;
      }
      throw new Error();
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
