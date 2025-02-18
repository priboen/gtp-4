import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProvider } from 'src/common/providers';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, userProvider],
})
export class UserModule {}
