import {
  Body,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Project, Task } from 'src/common/models';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY') private readonly taskModel: typeof Task,
    @Inject('PROJECT_REPOSITORY') private readonly projectModel: typeof Project,
  ) {}
  async findAll(projectId: number): Promise<ResponseDto<Task[]>> {
    const tasks = await this.taskModel.findAll({ where: { projectId } });
    if (!tasks.length) {
      throw new NotFoundException('No tasks found for this project.');
    }
    return new ResponseDto<Task[]>({ data: tasks });
  }

  async findOne(id: number, projectId: number): Promise<ResponseDto<Task>> {
    const task = await this.taskModel.findOne({ where: { id, projectId } });
    if (!task) {
      throw new NotFoundException('No task found with the given ID.');
    }
    return new ResponseDto<Task>({ data: task });
  }

  async create(
    projectId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<ResponseDto<Task>> {
    try {
      const projectExists = await this.projectModel.findByPk(projectId);
      if (!projectExists) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }
      const task = await this.taskModel.create({
        ...createTaskDto,
        projectId,
      });
      return new ResponseDto<Task>({ data: task });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    projectId: number,
    userId: number,
  ): Promise<ResponseDto<Task>> {
    const taskResponse = await this.findOne(id, projectId);
    const task = taskResponse.data;
    const project = await Project.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.ownerId !== userId) {
      const keys = Object.keys(updateTaskDto);
      if (keys.some((key) => key !== 'status')) {
        throw new ForbiddenException(
          'Only the project owner can update task details except status.',
        );
      }
    }
    await task.update(updateTaskDto);
    return new ResponseDto<Task>({ data: task });
  }

  async remove(id: number, projectId: number): Promise<ResponseDto> {
    try {
      const task = await this.findOne(id, projectId);
      await task.data.destroy();
      return new ResponseDto({ message: 'Task deleted successfully' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
