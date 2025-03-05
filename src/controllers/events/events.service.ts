import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  EventAttendances,
  Events,
  Project,
  TeamProject,
  User,
} from 'src/common/models';
import { CreateEventsDto } from './dto/create-events.dto';
import { UpdateEventsDto } from './dto/update-events.dto';
import { ResponseDto } from 'src/common/dto';
import { Optional } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENTS_REPOSITORY') private readonly eventsProvider: typeof Events,
    @Inject('EVENT_ATTENDANCE_REPOSITORY')
    private readonly eventAttendanceProvider: typeof EventAttendances,
    @Inject('PROJECT_REPOSITORY') private readonly projectModel: typeof Project,
  ) {}
  async findAll(projectId: number): Promise<any[]> {
    try {
      const events = await this.eventsProvider.findAll({
        where: { projectId },
        include: [{ model: EventAttendances, as: 'attendances' }],
      });
      if (!events.length) {
        throw new NotFoundException('No events found for this project');
      }
      return events.map((event) => {
        const attendingCount = event.attendances.filter(
          (a) => a.isAttending,
        ).length;
        const notAttendingCount = event.attendances.filter(
          (a) => a.isAttending === false,
        ).length;
        const notRespondedCount = event.attendances.filter(
          (a) => a.isAttending === null,
        ).length;
        return {
          ...event.toJSON(),
          attendanceSummary: {
            attending: attendingCount,
            notAttending: notAttendingCount,
            notResponded: notRespondedCount,
          },
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(projectId: number, id: number): Promise<ResponseDto<Events>> {
    try {
      const event = await this.eventsProvider.findOne({
        where: { projectId, id },
        include: [
          {
            model: EventAttendances,
            as: 'attendances',
            include: [{ model: User, attributes: ['id', 'name', 'email'] }],
          },
        ],
      });
      if (!event) {
        throw new NotFoundException('No Event found with this given id');
      }
      const attending = event.attendances.filter((a) => a.isAttending);
      const notAttending = event.attendances.filter(
        (a) => a.isAttending === false,
      );
      const notResponded = event.attendances.filter(
        (a) => a.isAttending === null,
      );
      const eventData = await event.toJSON();
      return new ResponseDto<Events>({
        data: {
          ...eventData,
          attendances: {
            attending: attending.map((a) => a.user),
            notAttending: notAttending.map((a) => a.user),
            notResponded: notResponded.map((a) => a.user),
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(
    projectId: number,
    createEventsProject: CreateEventsDto,
  ): Promise<ResponseDto<Events>> {
    const transaction = this.eventsProvider.sequelize
      ? await this.eventsProvider.sequelize.transaction()
      : null;
    if (!transaction) {
      throw new InternalServerErrorException('Unable to start transaction');
    }
    try {
      const projectExists = await this.projectModel.findByPk(projectId);
      if (!projectExists) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }
      const event = await this.eventsProvider.create(
        { ...createEventsProject, projectId },
        { transaction },
      );
      const teamMembers = await TeamProject.findAll({
        where: { projectId },
        attributes: ['userId'],
        transaction,
      });
      const eventAttendances = teamMembers.map((member) => ({
        eventId: event.id,
        userId: member.userId,
        isAttending: null,
      })) as Optional<
        EventAttendances,
        NullishPropertiesOf<EventAttendances>
      >[];
      await this.eventAttendanceProvider.bulkCreate(eventAttendances, {
        transaction,
      });
      await transaction.commit();
      return new ResponseDto<Events>({ data: event });
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    projectId: number,
    id: number,
    updateEventsDto: UpdateEventsDto,
  ): Promise<ResponseDto<Events>> {
    try {
      const events = await this.eventsProvider.findOne({
        where: { projectId, id },
      });
      if (!events) {
        throw new NotFoundException('Event not found');
      }
      await events.update(updateEventsDto);
      return new ResponseDto<Events>({ data: events });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(projectId: number, id: number): Promise<ResponseDto> {
    try {
      const events = await this.eventsProvider.findOne({
        where: { projectId, id },
      });
      if (!events) {
        throw new NotFoundException('Event not found');
      }
      const attendances = await this.eventAttendanceProvider.findAll({
        where: { eventId: id },
      });
      await Promise.all(attendances.map((a) => a.destroy()));
      await events.destroy();
      return new ResponseDto({ message: 'Event deleted successfully' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
