import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Project } from '../models/project.model';
import { TeamProject } from '../models/team-project.model';
import { AuthRequest } from 'src/types/request.interface';

@Injectable()
export class ProjectAccessMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded as { userId: number };
      const userId = req.user.userId;
      const projectId = req.params.id;
      const project = await Project.findOne({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      if (project.ownerId === userId) {
        return next();
      }
      const isTeamMember = await TeamProject.findOne({
        where: { projectId, userId },
      });
      if (!isTeamMember) {
        throw new ForbiddenException('You do not have access to this project');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token or access denied');
    }
  }
}
