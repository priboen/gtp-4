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
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { TeamProjectResponseDto } from './response/team-project-response.dto';
import { NotFoundResponseDto } from '../project/response/not-found-response.dto';
import { UnauthorizedResponseDto } from 'src/common/dto/unauthorized-response.dto';

@ApiTags('Team Projects')
@ApiBearerAuth()
@Controller('team-project')
@UseGuards(JwtAuthGuard, OwnerGuard)
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
    type: [TeamProjectResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No team members found for this project.',
    type: NotFoundResponseDto,
  })
  findAll(@Param('projectId') projectId: number) {
    return this.teamProjectService.findAll(projectId);
  }

  @Post(':projectId')
  @ApiOperation({
    summary: 'Add a member to a project',
    description: 'Add a user to a project team.',
  })
  @ApiResponse({
    status: 201,
    description: 'User added to project team successfully.',
    type: TeamProjectResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No team members found for this project.',
    type: NotFoundResponseDto,
  })
  create(
    @Param('projectId') projectId: number,
    @Body() createTeamProjectDto: CreateTeamProjectDto,
  ) {
    return this.teamProjectService.addMember(projectId, createTeamProjectDto);
  }

  @Delete(':projectId/:userId')
  @ApiOperation({
    summary: 'Remove a team member from a project',
    description: 'Remove a user from a project team.',
  })
  @ApiResponse({
    status: 200,
    description: 'User removed from project team successfully.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Team member with ID 1 has been removed successfully.',
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
    description: 'No team member found with the given ID.',
    type: NotFoundResponseDto,
  })
  remove(
    @Param('projectId') projectId: number,
    @Param('userId') userId: number,
  ) {
    return this.teamProjectService.removeMember(projectId, userId);
  }
}
