import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProjectAccessMiddleware } from '../../common/middleware/project-access.middleware';
import { AuthRequest } from 'src/types/request.interface';
import { TaskOwnerGuard } from 'src/common/guards/task-owner.guard';
import { TaskListResponseDto } from './response/task-list-response.dto';
import { UnauthorizedResponseDto } from '../../common/dto/unauthorized-response.dto';
import { NotFoundResponseDto } from './response/not-found-response.dto';
import { TaskResponseDto } from './response/task-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':projectId')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Get all tasks for a project',
    description: 'Retrieve all tasks associated with a project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully.',
    type: TaskListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No tasks found for this project.',
    type: NotFoundResponseDto,
  })
  findAll(@Param('projectId') projectId: number) {
    return this.taskService.findAll(projectId);
  }

  @Get(':projectId/:id')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Get a specific task',
    description: 'Retrieve details of a specific task from a project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task found successfully.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No task found with the given ID.',
    type: NotFoundResponseDto,
  })
  findOne(@Param('projectId') projectId: number, @Param('id') id: number) {
    return this.taskService.findOne(id, projectId);
  }

  @Post()
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Create a new task in a project. Only the project owner can create tasks.',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Patch(':projectId/:id')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Update a task',
    description:
      'Update a task in a project. Only the project owner can update all task details. Team members can only update the task status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No task found with the given ID.',
    type: NotFoundResponseDto,
  })
  update(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthRequest,
  ) {
    return this.taskService.update(
      id,
      updateTaskDto,
      projectId,
      req.user!.userId,
    );
  }

  @Delete(':projectId/:id')
  @UseGuards(TaskOwnerGuard)
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'Delete a task from a project. Only the project owner can delete tasks.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Task deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No task found with the given ID.',
    type: NotFoundResponseDto,
  })
  remove(@Param('projectId') projectId: number, @Param('id') id: number) {
    return this.taskService.remove(id, projectId);
  }
}
