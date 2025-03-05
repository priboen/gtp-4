import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Project } from 'src/common/models';
import { AuthRequest } from 'src/types/request.interface';

@Injectable()
export class ProjectOwnerMiddleware implements NestMiddleware {
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user || !req.user.userId) {
      throw new ForbiddenException('User is not authenticated.');
    }

    const userId = req.user.userId;
    const projectId = req.params.id;

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

    return next();
  }
}
