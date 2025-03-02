import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project, Task } from 'src/common/models';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY') private readonly taskModel: typeof Task,
  ) {}
  async findAll(projectId: number): Promise<Task[]> {
    const tasks = await this.taskModel.findAll({ where: { projectId } });
    if (!tasks.length) {
      throw new NotFoundException('No tasks found for this project.');
    }
    return tasks;
  }

  async findOne(id: number, projectId: number): Promise<Task> {
    const task = await this.taskModel.findOne({ where: { id, projectId } });
    if (!task) {
      throw new NotFoundException('No task found with the given ID.');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskModel.create({ ...createTaskDto });
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    projectId: number,
    userId: number,
  ): Promise<Task> {
    const task = await this.findOne(id, projectId);
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
    return task;
  }

  async remove(id: number, projectId: number): Promise<{ message: string }> {
    const task = await this.findOne(id, projectId);
    await task.destroy();
    return { message: 'Task deleted successfully' };
  }
}
