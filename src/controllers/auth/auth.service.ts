import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/models';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ResponseDto } from 'src/common/dto';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userModel: typeof User,
    private jwtService: JwtService,
  ) {}
  private removePassword(user: any) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }
  async register(createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const existingUser = await this.userModel.findOne({
        where: {
          [Op.or]: [
            { username: createUserDto.username },
            { email: createUserDto.email },
          ],
        },
      });
      if (existingUser) {
        return new ResponseDto<User>({
          message: 'Username or Email already registered',
        });
      }
      const user = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const userWithoutPassword = this.removePassword(user);
      return new ResponseDto<User>({ data: userWithoutPassword });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new InternalServerErrorException('Database constraint violation');
      }
      throw new InternalServerErrorException(
        `Error creating user: ${error.message}`,
      );
    }
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
}
