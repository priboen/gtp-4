import { ApiProperty } from '@nestjs/swagger';

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
}
