import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Task 1' })
  title: string;

  @ApiProperty({ example: 'Deskripsi Task 1' })
  description: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  updatedAt: string;
}
