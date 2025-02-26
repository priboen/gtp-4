import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { projectProvider, teamProjectProvider } from 'src/common/providers';
import { JwtModule } from '@nestjs/jwt';
import { TeamProjectService } from '../team-project/team-project.service';
import { MysqlModule } from 'src/common/modules';
import { ProjectOwnerMiddleware } from 'src/common/middleware/project-owner.middleware';

@Module({
  imports: [
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
})
export class ProjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectOwnerMiddleware)
      .forRoutes(
        { path: 'project/:id', method: RequestMethod.PATCH },
        { path: 'project/:id', method: RequestMethod.DELETE },
      );
  }
}
