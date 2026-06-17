import { Module } from '@nestjs/common';
import { ResetChecklistController } from './reset-checklists.controller';
import { ResetChecklistService } from './reset-checklists.service';

@Module({
  controllers: [ResetChecklistController],
  providers: [ResetChecklistService],
})
export class ResetChecklistModule {}
