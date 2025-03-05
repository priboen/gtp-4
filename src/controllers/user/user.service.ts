import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/models';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userModel: typeof User,
  ) {}

  private removePassword(user: any) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
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
