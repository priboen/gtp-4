import { ApiProperty } from '@nestjs/swagger';

class TaskDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Task 1' })
  title: string;

  @ApiProperty({ example: 'Description of Task 1' })
  description: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 2 })
  projectId: number;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  updatedAt: string;
}

class EventsDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Event 1' })
  name: string;

  @ApiProperty({ example: 'Description of Event 1' })
  description: string;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  date: string;

  @ApiProperty({ example: 2 })
  projectId: number;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-02-25T19:04:31.000Z' })
  updatedAt: string;
}

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

  @ApiProperty({
    example: { id: 1, name: 'John Doe', email: 'john@example.com' },
    description: 'User details',
  })
  user: { id: number; name: string; email: string };
}

export class ProjectDetailResponseDto {
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

  @ApiProperty({ type: [TaskDto], description: 'List of tasks' })
  tasks: TaskDto[];

  @ApiProperty({ type: [EventsDto], description: 'List of events' })
  events: EventsDto[];

  @ApiProperty({ type: [ProjectUserDto], description: 'List of project users' })
  projectUsers: ProjectUserDto[];
}
