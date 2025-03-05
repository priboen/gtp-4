import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './controllers/user/user.module';
import { MysqlModule } from './common/modules/mysql.module';
import { ProjectModule } from './controllers/project/project.module';
import { AuthModule } from './controllers/auth/auth.module';
import { ProjectAccessMiddleware } from './common/middleware/project-access.middleware';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './controllers/task/task.module';
import { EventsModule } from './controllers/events/events.module';
import { TeamProjectModule } from './controllers/team-project/team-project.module';
import { EventAttendancesModule } from './controllers/event-attendances/event-attendances.module';

@Module({
  imports: [
    MysqlModule,
    UserModule,
    ProjectModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TaskModule,
    EventsModule,
    TeamProjectModule,
    EventAttendancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectAccessMiddleware)
      .forRoutes(
        { path: 'projects/:id', method: RequestMethod.ALL },
        { path: 'tasks/:id', method: RequestMethod.ALL },
        { path: 'events/:id', method: RequestMethod.ALL },
      );
  }
}
