import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
}
