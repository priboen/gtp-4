import { Module } from '@nestjs/common';
import { TeamProjectService } from './team-project.service';
import { TeamProjectController } from './team-project.controller';
import { JwtModule } from '@nestjs/jwt';
import { teamProjectProvider } from 'src/common/providers';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TeamProjectController],
  providers: [TeamProjectService, teamProjectProvider],
})
export class TeamProjectModule {}
