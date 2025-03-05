import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
  async findAll(userId: number): Promise<ResponseDto<Project[]>> {
    try {
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
      return new ResponseDto<Project[]>({ data: projects });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number, userId: number): Promise<ResponseDto<Project>> {
    try {
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
      return new ResponseDto<Project>({ data: project });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(
    createProjectDto: CreateProjectDto,
    ownerId: number,
    teamProjects?: number[],
  ): Promise<ResponseDto<Project>> {
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
      return new ResponseDto<Project>({ data: project });
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    ownerId: number,
  ): Promise<ResponseDto<Project>> {
    try {
      const project = await this.findOne(id, ownerId);
      await project.data.update(updateProjectDto);
      return new ResponseDto<Project>({ data: project.data });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number, ownerId: number): Promise<ResponseDto> {
    try {
      const project = await this.findOne(id, ownerId);
      await project.data.destroy();
      return new ResponseDto({
        message: `Project with ID ${id} has been deleted successfully.`,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addMember(
    createTeamProjectDto: CreateTeamProjectDto,
  ): Promise<ResponseDto<TeamProject>> {
    try {
      const isMember = await this.teamProjectModel.findOne({
        where: {
          projectId: createTeamProjectDto.projectId,
          userId: createTeamProjectDto.userId,
        },
      });
      if (isMember) {
        throw new BadRequestException(
          'User is already a member of this project',
        );
      }
      const member = await this.teamProjectModel.create(
        createTeamProjectDto as Optional<
          TeamProject,
          NullishPropertiesOf<TeamProject>
        >,
      );
      return new ResponseDto<TeamProject>({ data: member });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeMember(id: number): Promise<ResponseDto> {
    try {
      const member = await this.teamProjectModel.findByPk(id);
      if (!member) {
        throw new NotFoundException('No team member found with the given ID.');
      }
      await member.destroy();
      return new ResponseDto({
        message: `Team member with ID ${id} has been removed successfully.`,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
