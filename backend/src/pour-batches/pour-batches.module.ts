import { Module } from '@nestjs/common';
import { PourBatchesController } from './pour-batches.controller';
import { PourBatchesService } from './pour-batches.service';

@Module({
  controllers: [PourBatchesController],
  providers: [PourBatchesService],
})
export class PourBatchesModule {}
