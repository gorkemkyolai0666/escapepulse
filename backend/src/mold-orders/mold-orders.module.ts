import { Module } from '@nestjs/common';
import { MoldOrdersController } from './mold-orders.controller';
import { MoldOrdersService } from './mold-orders.service';

@Module({
  controllers: [MoldOrdersController],
  providers: [MoldOrdersService],
})
export class MoldOrdersModule {}
