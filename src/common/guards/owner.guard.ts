import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Project } from 'src/common/models/project.model';
import { AuthRequest } from 'src/types/request.interface';

@Injectable()
export class OwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const userId = req.user?.userId;
    const projectId = req.params.projectId;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const project = await Project.findOne({ where: { id: projectId } });
    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the project owner can perform this action',
      );
    }

    return true;
  }
}
