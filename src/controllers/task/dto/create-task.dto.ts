import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Task Title',
    description: 'Title of the task',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Task Description',
    description: 'Description of the task',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Project ID',
    description: 'ID of the project to which the task belongs',
  })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
