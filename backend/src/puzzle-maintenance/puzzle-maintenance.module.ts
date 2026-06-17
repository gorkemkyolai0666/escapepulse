import { Module } from '@nestjs/common';
import { PuzzleMaintenanceController } from './puzzle-maintenance.controller';
import { PuzzleMaintenanceService } from './puzzle-maintenance.service';

@Module({
  controllers: [PuzzleMaintenanceController],
  providers: [PuzzleMaintenanceService],
})
export class PuzzleMaintenanceModule {}
