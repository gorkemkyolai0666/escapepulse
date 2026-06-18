import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ResinStudioModule } from './resin-studio/resin-studio.module';
import { WorkstationsModule } from './workstations/workstations.module';
import { PourBatchesModule } from './pour-batches/pour-batches.module';
import { EquipmentRepairModule } from './equipment-repairs/equipment-repair.module';
import { CuringChecklistModule } from './curing-checklists/curing-checklists.module';
import { WorkshopRatesModule } from './workshop-rates/workshop-rates.module';
import { MoldOrdersModule } from './mold-orders/mold-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    ResinStudioModule,
    WorkstationsModule,
    PourBatchesModule,
    EquipmentRepairModule,
    CuringChecklistModule,
    WorkshopRatesModule,
    MoldOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
