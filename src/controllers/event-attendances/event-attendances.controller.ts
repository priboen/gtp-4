import {
  Controller,
  Param,
  Patch,
  Request,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { EventAttendancesService } from './event-attendances.service';
import { ConfirmAttendanceDto } from './dto/confirm-attendance.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthRequest } from 'src/types/request.interface';
import { ProjectAccessMiddleware } from 'src/common/middleware/project-access.middleware';
import { TeamGuard } from 'src/common/guards/team.guard';

@ApiTags('Event Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TeamGuard)
@Controller('event-attendance')
export class EventAttendancesController {
  constructor(
    private readonly eventAttendanceService: EventAttendancesService,
  ) {}

  @Patch(':eventId/confirm')
  @ApiOperation({
    summary: 'Confirm attendance for an event',
    description:
      'Team members can confirm their attendance status for an event.',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance confirmed successfully.',
    schema: {
      example: {
        message: 'Attendance confirmed successfully',
        attendance: {
          eventId: 1,
          userId: 2,
          isAttending: true,
        },
      },
    },
  })
  confirmAttendance(
    @Param('eventId') eventId: number,
    @Request() req: AuthRequest,
    @Body() confirmAttendanceDto: ConfirmAttendanceDto,
  ) {
    return this.eventAttendanceService.confirmAttendance(
      eventId,
      req.user!.userId,
      confirmAttendanceDto,
    );
  }

  @Get(':eventId')
  @ApiOperation({
    summary: 'Get attendance for an event',
    description: 'Retrieve attendance records for an event.',
  })
  async getAttendances(@Param('eventId') eventId: number) {
    return this.eventAttendanceService.getAttendances(eventId);
  }
}
