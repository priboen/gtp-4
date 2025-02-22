import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Project } from 'src/common/models';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY') private readonly projectModel: typeof Project,
  ) {}
  async findAll(ownerId: number): Promise<Project[]> {
    const projects = await this.projectModel.findAll({ where: { ownerId } });
    if (projects.length === 0) {
      throw new NotFoundException('Projects not found');
    }
    return projects;
  }

  async findOne(id: number, ownerId: number): Promise<Project> {
    const project = await this.projectModel.findOne({ where: { id, ownerId } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(
    createProjectDto: CreateProjectDto,
    ownerId: number,
  ): Promise<Project> {
    const project = this.projectModel.build({
      ...createProjectDto,
      ownerId,
    } as Project);
    await project.save();
    return project;
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

  async remove(id: number, ownerId: number): Promise<void> {
    const project = await this.findOne(id, ownerId);
    await project.destroy();
  }
}
