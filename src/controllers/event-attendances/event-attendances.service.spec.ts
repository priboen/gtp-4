import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendancesService } from './event-attendances.service';

describe('EventAttendancesService', () => {
  let service: EventAttendancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventAttendancesService],
    }).compile();

    service = module.get<EventAttendancesService>(EventAttendancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
