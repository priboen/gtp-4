import { Module } from '@nestjs/common';
import { TeamProjectService } from './team-project.service';
import { TeamProjectController } from './team-project.controller';
import { JwtModule } from '@nestjs/jwt';
import { teamProjectProvider } from 'src/common/providers';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TeamProjectController],
  providers: [TeamProjectService, teamProjectProvider],
})
export class TeamProjectModule {}
