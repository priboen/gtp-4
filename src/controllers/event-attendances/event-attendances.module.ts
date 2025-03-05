import { Module } from '@nestjs/common';
import { EventAttendancesService } from './event-attendances.service';
import { EventAttendancesController } from './event-attendances.controller';
import { JwtModule } from '@nestjs/jwt';
import { eventAttendanceProvider } from 'src/common/providers';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [EventAttendancesController],
  providers: [EventAttendancesService, eventAttendanceProvider],
  exports: [EventAttendancesService, eventAttendanceProvider],
})
export class EventAttendancesModule {}
