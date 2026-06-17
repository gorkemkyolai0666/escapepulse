import { Module } from '@nestjs/common';
import { EscapeVenueController } from './escape-venue.controller';
import { EscapeVenueService } from './escape-venue.service';

@Module({
  controllers: [EscapeVenueController],
  providers: [EscapeVenueService],
})
export class EscapeVenueModule {}
