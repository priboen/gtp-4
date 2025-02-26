import { ApiProperty } from '@nestjs/swagger';

class ProjectUserDto {
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
}

export class ProjectResponseDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'Project CMS' })
  name: string;

  @ApiProperty({ example: 1 })
  ownerId: number;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-25T19:06:33.000Z' })
  updatedAt: string;

  @ApiProperty({ type: [ProjectUserDto], description: 'List of project users' })
  projectUsers: ProjectUserDto[];
}
