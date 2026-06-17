import { Module } from '@nestjs/common';
import { PropOrdersController } from './prop-orders.controller';
import { PropOrdersService } from './prop-orders.service';

@Module({
  controllers: [PropOrdersController],
  providers: [PropOrdersService],
})
export class PropOrdersModule {}
