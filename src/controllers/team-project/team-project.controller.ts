import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeamProjectService } from './team-project.service';
import { CreateTeamProjectDto } from './dto/create-team-project.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Team Projects')
@ApiBearerAuth()
@Controller('team-project')
@UseGuards(JwtAuthGuard)
export class TeamProjectController {
  constructor(private readonly teamProjectService: TeamProjectService) {}

  @Get(':projectId')
  @ApiOperation({
    summary: 'Get all team members for a project',
    description: 'Retrieve all users who are part of a specific project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Team members retrieved successfully.',
    schema: {
      example: [
        {
          id: 1,
          projectId: 1,
          userId: 2,
          createdAt: '2025-08-24T12:00:00.000Z',
          updatedAt: '2025-08-24T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No team members found for this project.',
  })
  findAll(@Param('projectId') projectId: number) {
    return this.teamProjectService.findAll(projectId);
  }

  @Post()
  @ApiOperation({
    summary: 'Add a member to a project',
    description: 'Add a user to a project team.',
  })
  @ApiResponse({
    status: 201,
    description: 'User added to project team successfully.',
    schema: {
      example: {
        id: 1,
        projectId: 1,
        userId: 2,
        createdAt: '2025-08-24T12:00:00.000Z',
        updatedAt: '2025-08-24T12:00:00.000Z',
      },
    },
  })
  create(@Body() createTeamProjectDto: CreateTeamProjectDto) {
    return this.teamProjectService.addMember(createTeamProjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a team member from a project',
    description: 'Remove a user from a project team.',
  })
  @ApiResponse({
    status: 200,
    description: 'User removed from project team successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No team member found with the given ID.',
  })
  remove(@Param('id') id: number) {
    return this.teamProjectService.remove(id);
  }
}
