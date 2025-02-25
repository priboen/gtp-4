import { Test, TestingModule } from '@nestjs/testing';
import { TeamProjectController } from './team-project.controller';
import { TeamProjectService } from './team-project.service';

describe('TeamProjectController', () => {
  let controller: TeamProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamProjectController],
      providers: [TeamProjectService],
    }).compile();

    controller = module.get<TeamProjectController>(TeamProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
