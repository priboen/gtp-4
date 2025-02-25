import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TeamProject } from 'src/common/models';
import { CreateTeamProjectDto } from './dto/create-team-project.dto';

@Injectable()
export class TeamProjectService {
  constructor(
    @Inject('TEAM_PROJECT_REPOSITORY')
    private readonly teamProjectProvider: typeof TeamProject,
  ) {}
  async findAll(projectId: number): Promise<TeamProject[]> {
    return this.teamProjectProvider.findAll({ where: { projectId } });
  }

  async addMember(
    createTeamProjectDto: CreateTeamProjectDto,
  ): Promise<TeamProject> {
    return this.teamProjectProvider.create(createTeamProjectDto as TeamProject);
  }

  async remove(id: number): Promise<void> {
    const member = await this.teamProjectProvider.findByPk(id);
    if (!member) {
      throw new NotFoundException('No team member found with the given ID.');
    }
    await member.destroy();
  }
}
