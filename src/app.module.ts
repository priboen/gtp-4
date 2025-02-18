import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './controllers/user/user.module';
import { MysqlModule } from './common/modules/mysql.module';

@Module({
  imports: [MysqlModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
