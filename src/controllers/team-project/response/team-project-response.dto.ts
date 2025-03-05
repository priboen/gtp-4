import { ApiProperty } from '@nestjs/swagger';

export class TeamProjectResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the team project association',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The project ID to which the user belongs',
  })
  projectId: number;

  @ApiProperty({
    example: 2,
    description: 'The user ID of the team member',
  })
  userId: number;

  @ApiProperty({
    example: '2025-08-24T12:00:00.000Z',
    description: 'The created date of the team project entry',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-08-24T12:00:00.000Z',
    description: 'The updated date of the team project entry',
  })
  updatedAt: string;
}
