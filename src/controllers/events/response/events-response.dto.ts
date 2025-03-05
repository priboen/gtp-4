import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the event',
  })
  id: number;

  @ApiProperty({
    example: 'Meeting with Mr. Adri Khamid',
    description: 'The name of the event',
  })
  name: string;

  @ApiProperty({
    example: 'Discuss about project',
    description: 'The description of the event',
  })
  description: string;

  @ApiProperty({
    example: '2025-08-24T12:00:00.000Z',
    description: 'The date of the event',
  })
  date: string;

  @ApiProperty({
    example: 1,
    description: 'The project ID to which the event belongs',
  })
  projectId: number;

  @ApiProperty({
    example: '2025-08-24T12:00:00.000Z',
    description: 'The created date of the event',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-08-24T12:00:00.000Z',
    description: 'The updated date of the event',
  })
  updatedAt: string;

  @ApiProperty({
    description:
      'Attendance summary containing the counts of attending, not attending, and not responded users',
    example: {
      attending: 5,
      notAttending: 3,
      notResponded: 2,
    },
    type: Object,
  })
  attendanceSummary: {
    attending: number;
    notAttending: number;
    notResponded: number;
  };

  @ApiProperty({
    description: 'List of users who are attending the event',
    example: {
      attending: [
        { id: 2, name: 'John Doe', email: 'john@example.com' },
        { id: 3, name: 'Alice Smith', email: 'alice@example.com' },
      ],
      notAttending: [{ id: 4, name: 'Bob Brown', email: 'bob@example.com' }],
      notResponded: [
        { id: 5, name: 'Charlie White', email: 'charlie@example.com' },
      ],
    },
    type: Object,
  })
  attendees: {
    attending: { id: number; name: string; email: string }[];
    notAttending: { id: number; name: string; email: string }[];
    notResponded: { id: number; name: string; email: string }[];
  };
}
