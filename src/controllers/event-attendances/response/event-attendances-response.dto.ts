import { ApiProperty } from '@nestjs/swagger';

export class EventAttendancesResponseDto {
  @ApiProperty({ example: true })
  isAttending: boolean;
}
