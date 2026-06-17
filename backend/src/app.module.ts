import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { EscapeVenueModule } from './escape-venue/escape-venue.module';
import { EscapeRoomsModule } from './escape-rooms/escape-rooms.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';
import { PuzzleMaintenanceModule } from './puzzle-maintenance/puzzle-maintenance.module';
import { ResetChecklistModule } from './reset-checklists/reset-checklists.module';
import { RateTiersModule } from './rate-tiers/rate-tiers.module';
import { PropOrdersModule } from './prop-orders/prop-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    EscapeVenueModule,
    EscapeRoomsModule,
    GameSessionsModule,
    PuzzleMaintenanceModule,
    ResetChecklistModule,
    RateTiersModule,
    PropOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
