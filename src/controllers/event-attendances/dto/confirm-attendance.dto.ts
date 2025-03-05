import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAttendanceDto {
  @ApiProperty({ example: true, description: 'Attendance confirmation status' })
  isAttending: boolean;
}
