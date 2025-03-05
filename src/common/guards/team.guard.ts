import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Events } from 'src/common/models/events.model';
import { TeamProject } from 'src/common/models/team-project.model';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const { eventId } = request.params;
    if (typeof eventId !== 'string') {
      throw new BadRequestException('Invalid event ID');
    }
    const event = await Events.findByPk(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.projectId === userId) {
      return true;
    }
    const isTeamMember = await TeamProject.findOne({
      where: { projectId: event.projectId, userId },
    });
    if (!isTeamMember) {
      throw new ForbiddenException(
        'You must be a project owner or a team member to access this.',
      );
    }
    return true;
  }
}
