import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Project } from 'src/common/models';
import { AuthRequest } from 'src/types/request.interface';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (!request.user || !request.user.userId) {
      throw new ForbiddenException('User is not authenticated.');
    }

    const userId = request.user.userId;
    const projectId = request.params.id;

    if (!projectId) {
      throw new ForbiddenException('Project ID is required.');
    }

    const project = await Project.findOne({ where: { id: projectId } });

    if (!project) {
      throw new ForbiddenException('Project not found.');
    }

    if (Number(userId) !== Number(project.ownerId)) {
      throw new ForbiddenException(
        'Only the project owner can perform this action.',
      );
    }

    return true;
  }
}
