import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { projectProvider, teamProjectProvider } from 'src/common/providers';
import { JwtModule } from '@nestjs/jwt';
import { TeamProjectService } from '../team-project/team-project.service';
import { MysqlModule } from 'src/common/modules';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MysqlModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    projectProvider,
    TeamProjectService,
    teamProjectProvider,
  ],
  exports: [ProjectService, projectProvider],
})
export class ProjectModule {}
