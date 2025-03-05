import {
  Injectable,
  NotFoundException,
  Inject,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventAttendances } from 'src/common/models/event-attendance.model';
import { Events } from 'src/common/models/events.model';
import { TeamProject } from 'src/common/models/team-project.model';
import { ConfirmAttendanceDto } from './dto/confirm-attendance.dto';
import { User } from 'src/common/models';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class EventAttendancesService {
  constructor(
    @Inject('EVENT_ATTENDANCE_REPOSITORY')
    private readonly eventAttendanceModel: typeof EventAttendances,
  ) {}

  async confirmAttendance(
    eventId: number,
    userId: number,
    dto: ConfirmAttendanceDto,
  ): Promise<ResponseDto<EventAttendances>> {
    try {
      const event = await Events.findByPk(eventId);
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      const isTeamMember = await TeamProject.findOne({
        where: { projectId: event.projectId, userId },
      });
      if (!isTeamMember) {
        throw new ForbiddenException('You are not a member of this project');
      }
      let attendance = await this.eventAttendanceModel.findOne({
        where: { eventId, userId },
      });
      if (attendance) {
        attendance.isAttending = dto.isAttending;
        await attendance.save();
      } else {
        attendance = await this.eventAttendanceModel.create({
          eventId,
          userId,
          isAttending: dto.isAttending,
        } as EventAttendances);
      }
      return new ResponseDto<EventAttendances>({ data: attendance });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAttendances(
    eventId: number,
  ): Promise<ResponseDto<EventAttendances[]>> {
    try {
      const attendances = await this.eventAttendanceModel.findAll({
        where: { eventId },
        include: [{ model: User, as: 'user' }],
      });
      return new ResponseDto<EventAttendances[]>({ data: attendances });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
