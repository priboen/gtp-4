import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Project Name',
    description: 'Name of the project',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'User ID',
    description: 'ID of the user who owns the project',
  })
  @IsNotEmpty()
  ownerId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  teamMembers?: number[];
}
