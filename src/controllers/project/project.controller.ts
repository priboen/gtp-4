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
import { ProjectService } from './project.service';
import { ProjectAccessMiddleware } from 'src/common/middleware/project-access.middleware';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Project } from 'src/common/models/project.model';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { error } from 'console';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Retrieve all projects owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully.',
    schema: {
      example: [
        {
          id: 1,
          name: 'Project 1',
          ownerId: 1,
          createdAt: '2021-08-24T12:00:00.000Z',
          updatedAt: '2021-08-24T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Projects not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token is Required',
        error: 'Unauthorized',
      },
    },
  })
  findAll(@Request() req) {
    return this.projectService.findAll(req.user.userId as number);
  }

  @Get(':id')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Get a specific project',
    description:
      'Retrieve details of a specific project owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project found successfully.',
    schema: {
      example: {
        id: 1,
        name: 'Project 1',
        ownerId: 1,
        createdAt: '2021-08-24T12:00:00.000Z',
        updatedAt: '2021-08-24T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token is Required',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No project found with the given ID.',
  })
  findOne(
    @Param('id') id: number,
    @Request() req: { user: { userId: number } },
  ) {
    return this.projectService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new project',
    description:
      'Create a new project and assign it to the authenticated user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully.',
    schema: {
      example: {
        id: 1,
        name: 'Project 1',
        ownerId: 1,
        createdAt: '2021-08-24T12:00:00.000Z',
        updatedAt: '2021-08-24T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token is Required',
        error: 'Unauthorized',
      },
    },
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: { user: { userId: number } },
  ) {
    return this.projectService.create(createProjectDto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Update a project',
    description:
      'Update details of a specific project owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully.',
    schema: {
      example: {
        id: 1,
        name: 'Project 1',
        ownerId: 1,
        createdAt: '2021-08-24T12:00:00.000Z',
        updatedAt: '2021-08-24T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No project found with the given ID.',
  })
  update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: { user: { userId: number } },
  ) {
    return this.projectService.update(id, updateProjectDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Delete a specific project owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No project found with the given ID.',
  })
  remove(
    @Param('id') id: number,
    @Request() req: { user: { userId: number } },
  ) {
    return this.projectService.remove(id, req.user.userId);
  }
}
