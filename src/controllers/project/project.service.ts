import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Events, Project, Task, TeamProject, User } from 'src/common/models';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTeamProjectDto } from '../team-project/dto/create-team-project.dto';
import { Sequelize } from 'sequelize-typescript';
import { Optional, Op } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @Inject('PROJECT_REPOSITORY') private readonly projectModel: typeof Project,
    @Inject('TEAM_PROJECT_REPOSITORY')
    private readonly teamProjectModel: typeof TeamProject,
  ) {}
  async findAll(userId: number): Promise<Project[]> {
    const projects = await this.projectModel.findAll({
      include: [
        {
          model: TeamProject,
          as: 'projectUsers',
          where: { userId },
          required: false,
        },
      ],
      where: {
        [Op.or]: [{ ownerId: userId }, { '$projectUsers.userId$': userId }],
      },
    });
    if (projects.length === 0) {
      throw new NotFoundException('No projects found for this user.');
    }
    return projects;
  }

  async findOne(id: number, userId: number): Promise<Project> {
    const hasAccess = await this.projectModel.findOne({
      where: {
        id,
        [Op.or]: [{ ownerId: userId }, { '$projectUsers.userId$': userId }],
      },
      include: [
        {
          model: TeamProject,
          as: 'projectUsers',
          required: false,
        },
      ],
    });
    if (!hasAccess) {
      throw new NotFoundException('Project Not Found or Access Denied');
    }
    const project = await this.projectModel.findOne({
      where: { id },
      include: [
        { model: Task, as: 'tasks' },
        { model: Events, as: 'events' },
        {
          model: TeamProject,
          as: 'projectUsers',
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      subQuery: false,
    });
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }
    return project;
  }

  async create(
    createProjectDto: CreateProjectDto,
    ownerId: number,
    teamProjects?: number[],
  ): Promise<Project> {
    const transaction = await this.sequelize.transaction();
    try {
      const project = await this.projectModel.create(
        { ...createProjectDto, ownerId } as Project,
        { transaction },
      );
      await this.teamProjectModel.create(
        { projectId: project.id, userId: ownerId } as TeamProject,
        { transaction },
      );
      if (teamProjects && teamProjects.length > 0) {
        const teamEntries = teamProjects.map((userId) => ({
          projectId: project.id,
          userId,
        })) as Optional<TeamProject, NullishPropertiesOf<TeamProject>>[];
        await this.teamProjectModel.bulkCreate(teamEntries, { transaction });
      }
      await transaction.commit();
      return project;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(
        'Failed to create project and team members',
      );
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    ownerId: number,
  ): Promise<Project> {
    const project = await this.findOne(id, ownerId);
    await project.update(updateProjectDto);
    return project;
  }

  async remove(id: number, ownerId: number): Promise<ResponseDto> {
    const project = await this.findOne(id, ownerId);
    await project.destroy();
    return new ResponseDto({
      message: `Project with ID ${id} has been deleted successfully.`,
    });
  }

  async addMember(
    createTeamProjectDto: CreateTeamProjectDto,
  ): Promise<TeamProject> {
    return this.teamProjectModel.create(createTeamProjectDto as TeamProject);
  }

  async removeMember(id: number): Promise<void> {
    const member = await this.teamProjectModel.findByPk(id);
    if (!member) {
      throw new NotFoundException('No team member found with the given ID.');
    }
    await member.destroy();
  }
}
