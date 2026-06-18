import { Module } from '@nestjs/common';
import { EquipmentRepairController } from './equipment-repair.controller';
import { EquipmentRepairService } from './equipment-repair.service';

@Module({
  controllers: [EquipmentRepairController],
  providers: [EquipmentRepairService],
})
export class EquipmentRepairModule {}
