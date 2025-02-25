import { Test, TestingModule } from '@nestjs/testing';
import { TeamProjectService } from './team-project.service';

describe('TeamProjectService', () => {
  let service: TeamProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamProjectService,
        {
          provide: 'TEAM_PROJECT_REPOSITORY',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TeamProjectService>(TeamProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
