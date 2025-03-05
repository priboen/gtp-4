import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Project, TeamProject, User } from 'src/common/models';
import { CreateTeamProjectDto } from './dto/create-team-project.dto';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class TeamProjectService {
  constructor(
    @Inject('TEAM_PROJECT_REPOSITORY')
    private readonly teamProjectProvider: typeof TeamProject,
    @Inject('USER_REPOSITORY') private readonly userProvider: typeof User,
    @Inject('PROJECT_REPOSITORY')
    private readonly projectProvider: typeof Project,
  ) {}
  async findAll(projectId: number): Promise<TeamProject[]> {
    return this.teamProjectProvider.findAll({ where: { projectId } });
  }

  async addMember(
    projectId: number,
    createTeamProjectDto: CreateTeamProjectDto,
  ): Promise<ResponseDto<TeamProject>> {
    const { userId } = createTeamProjectDto;
    const user = await this.userProvider.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const project = await this.projectProvider.findByPk(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const existingMember = await this.teamProjectProvider.findOne({
      where: { projectId, userId },
    });
    if (existingMember) {
      throw new BadRequestException('User is already a member of the project');
    }
    const newMember = await this.teamProjectProvider.create({
      projectId,
      userId,
    } as TeamProject);
    return new ResponseDto<TeamProject>({ data: newMember });
  }

  async removeMember(projectId: number, userId: number): Promise<ResponseDto> {
    try {
      const member = await this.teamProjectProvider.findOne({
        where: { projectId, userId },
      });
      if (!member) {
        throw new NotFoundException('No team member found with the given ID.');
      }
      await member.destroy();
      return new ResponseDto({
        message: `Team member with ID ${userId} has been removed successfully.`,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
