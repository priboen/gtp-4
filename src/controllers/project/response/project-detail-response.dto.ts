import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from './project-response.dto';

class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;
}

class TeamProjectDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 2 })
  projectId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  updatedAt: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class ProjectDetailResponseDto extends ProjectResponseDto {
  @ApiProperty({ type: [TeamProjectDto] })
  projectUsers: TeamProjectDto[];
}
