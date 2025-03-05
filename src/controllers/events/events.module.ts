import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { JwtModule } from '@nestjs/jwt';
import { eventsProvider } from 'src/common/providers';
import { EventAttendancesService } from '../event-attendances/event-attendances.service';
import { EventAttendancesModule } from '../event-attendances/event-attendances.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    ProjectModule,
    EventAttendancesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService, eventsProvider],
})
export class EventsModule {}
