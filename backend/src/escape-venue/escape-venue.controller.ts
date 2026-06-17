import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { EscapeVenueService } from './escape-venue.service';
import { UpdateEscapeVenueDto } from './dto/update-escape-venue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('escape-venue')
@UseGuards(JwtAuthGuard)
export class EscapeVenueController {
  constructor(private escapeVenueService: EscapeVenueService) {}

  @Get()
  get(@Request() req: { user: { escapeVenueId: string } }) {
    return this.escapeVenueService.get(req.user.escapeVenueId);
  }

  @Patch()
  update(
    @Request() req: { user: { escapeVenueId: string } },
    @Body() dto: UpdateEscapeVenueDto,
  ) {
    return this.escapeVenueService.update(req.user.escapeVenueId, dto);
  }
}
