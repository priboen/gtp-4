import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDto } from './dto/create-events.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProjectAccessMiddleware } from 'src/common/middleware/project-access.middleware';
import { UpdateEventsDto } from './dto/update-events.dto';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { EventResponseDto } from './response/events-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UnauthorizedResponseDto } from 'src/common/dto/unauthorized-response.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('event')
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get(':projectId')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Get all events for a project',
    description: 'Retrieve all events associated with a project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully.',
    type: [EventResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No events found for this project.',
    type: ErrorResponseDto,
  })
  findAll(@Param('projectId') projectId: number) {
    return this.eventService.findAll(projectId);
  }

  @Get(':projectId/:id')
  @UseGuards(ProjectAccessMiddleware)
  @ApiOperation({
    summary: 'Get a specific event',
    description:
      'Retrieve details of an event along with users who are attending, not attending, and not responded.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event found successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  findOne(@Param('projectId') projectId: number, @Param('id') id: number) {
    return this.eventService.findOne(projectId, id);
  }

  @Post(':projectId')
  @UseGuards(OwnerGuard)
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Create a new event in a project.',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No events found for this project.',
    type: ErrorResponseDto,
  })
  create(
    @Param('projectId') projectId: number,
    @Body() createEventDto: CreateEventsDto,
  ) {
    return this.eventService.create(projectId, createEventDto);
  }

  @Patch(':projectId/:id')
  @UseGuards(OwnerGuard)
  @ApiOperation({
    summary: 'Update an event',
    description: 'Update details of an event in a project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No event found with the given ID.',
  })
  update(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventsDto,
  ) {
    console.log('Project ID:', projectId);
    console.log('Event ID:', id);
    return this.eventService.update(projectId, id, updateEventDto);
  }

  @Delete(':projectId/:id')
  @UseGuards(OwnerGuard)
  @ApiOperation({
    summary: 'Delete an event',
    description: 'Delete an event from a project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully.',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No event found with the given ID.',
    type: ErrorResponseDto,
  })
  remove(@Param('projectId') projectId: number, @Param('id') id: number) {
    return this.eventService.remove(projectId, id);
  }
}
