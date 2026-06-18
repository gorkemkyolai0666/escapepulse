import { Module } from '@nestjs/common';
import { WorkshopRatesController } from './workshop-rates.controller';
import { WorkshopRatesService } from './workshop-rates.service';

@Module({
  controllers: [WorkshopRatesController],
  providers: [WorkshopRatesService],
})
export class WorkshopRatesModule {}
