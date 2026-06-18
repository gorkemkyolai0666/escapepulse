import { Module } from '@nestjs/common';
import { CuringChecklistController } from './curing-checklists.controller';
import { CuringChecklistService } from './curing-checklists.service';

@Module({
  controllers: [CuringChecklistController],
  providers: [CuringChecklistService],
})
export class CuringChecklistModule {}
