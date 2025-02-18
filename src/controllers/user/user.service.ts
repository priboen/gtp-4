import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/models';
import { ResponseDto } from 'src/common/dto';
import * as bcrypt from 'bcrypt';
import { Sequelize, Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userModel: typeof User,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private removePassword(user: any) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    try {
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
      const hashedPassword = await this.hashPassword(createUserDto.password);
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

  async findAll(): Promise<ResponseDto<User[]>> {
    try {
      const users = await this.userModel.findAll();
      const usersWithoutPassword = users.map((user) =>
        this.removePassword(user),
      );
      if (usersWithoutPassword.length === 0) {
        return new ResponseDto<User[]>({ message: 'No users found' });
      }
      return new ResponseDto<User[]>({ data: usersWithoutPassword });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error retrieving users: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<ResponseDto<User>> {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      await user.id();
      const userWithoutPassword = this.removePassword(user);
      return new ResponseDto<User>({ data: userWithoutPassword });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error retrieving user: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      await user.update(updateUserDto);
      const userWithoutPassword = this.removePassword(user);
      return new ResponseDto<User>({ data: userWithoutPassword });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<ResponseDto<{ message: string }>> {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      await user.destroy();
      return new ResponseDto<{ message: string }>({
        data: { message: `User with id ${id} removed successfully` },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting user: ${error.message}`,
      );
    }
  }
}
