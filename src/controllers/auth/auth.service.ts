import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/models';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userModel: typeof User,
    private jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userModel.findOne({
        where: { username: loginDto.username },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid username or password');
      }
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid username or password');
      }
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in .env');
      }
      const payload = { userId: user.id, username: user.username };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      console.error('Login Error:', error);
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.userModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
