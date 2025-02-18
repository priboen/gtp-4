import { Module } from '@nestjs/common';
import { mysqlProvider } from '../providers';

@Module({
  providers: [mysqlProvider],
  exports: [mysqlProvider],
})
export class MysqlModule {}
