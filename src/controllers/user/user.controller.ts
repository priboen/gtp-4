import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private validateId(id: string): number {
    const userId = Number(id);
    if (isNaN(userId) || userId <= 0) {
      throw new BadRequestException('Please insert a valid user id');
    }
    return userId;
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get one user' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    const userId = this.validateId(id);
    return this.userService.findOne(userId);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update a user by id' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = this.validateId(id);
    return this.userService.update(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by id' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    const userId = this.validateId(id);
    return this.userService.remove(userId);
  }
}
