import { ProjectOwnerGuard } from './../../common/guards/project-owner.guard';
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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProjectResponseDto } from './response/project-response.dto';
import { ProjectDetailResponseDto } from './response/project-detail-response.dto';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';
import { UnauthorizedResponseDto } from '../../common/dto/unauthorized-response.dto';
import { NotFoundResponseDto } from './response/not-found-response.dto';
import { AuthRequest } from 'src/types/request.interface';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new project and add team members',
    description: 'Create a new project and optionally add team members.',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully along with team members.',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: { user: { userId: number } },
  ) {
    const teamMembers = createProjectDto['teamMembers'];
    return this.projectService.create(
      createProjectDto,
      req.user.userId,
      teamMembers,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Retrieve all projects owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully.',
    type: [ProjectResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No projects found.',
    type: NotFoundResponseDto,
  })
  findAll(@Request() req) {
    return this.projectService.findAll(req.user.userId as number);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific project',
    description:
      'Retrieve details of a specific project owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project found successfully.',
    type: ProjectDetailResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
    type: NotFoundResponseDto,
  })
  findOne(
    @Param('id') id: number,
    @Request() req: { user: { userId: number } },
  ) {
    return this.projectService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({
    summary: 'Update a project',
    description:
      'Update details of a specific project owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully.',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
    type: NotFoundResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: AuthRequest,
  ) {
    if (req.user?.userId === undefined) {
      throw new Error('User ID is undefined');
    }
    return this.projectService.update(id, updateProjectDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Delete a specific project owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully.',
    schema: {
      example: {
        message: 'Project with ID 1 has been deleted successfully.',
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
    description: 'Project not found.',
    type: NotFoundResponseDto,
  })
  async remove(@Param('id') id: number, @Request() req: AuthRequest) {
    if (req.user?.userId === undefined) {
      throw new Error('User ID is undefined');
    }
    return this.projectService.remove(id, req.user.userId);
  }
}
