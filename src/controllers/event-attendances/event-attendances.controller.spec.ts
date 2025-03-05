import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendancesController } from './event-attendances.controller';
import { EventAttendancesService } from './event-attendances.service';

describe('EventAttendancesController', () => {
  let controller: EventAttendancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventAttendancesController],
      providers: [EventAttendancesService],
    }).compile();

    controller = module.get<EventAttendancesController>(EventAttendancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
