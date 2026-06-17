import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { PuzzleMaintenanceService } from './puzzle-maintenance.service';
import {
  CreatePuzzleMaintenanceDto,
  UpdatePuzzleMaintenanceDto,
} from './dto/puzzle-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('puzzle-maintenance')
@UseGuards(JwtAuthGuard)
export class PuzzleMaintenanceController {
  constructor(private puzzleMaintenanceService: PuzzleMaintenanceService) {}

  @Get()
  list(
    @Request() req: { user: { escapeVenueId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.puzzleMaintenanceService.list(req.user.escapeVenueId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { escapeVenueId: string } }) {
    return this.puzzleMaintenanceService.urgent(req.user.escapeVenueId);
  }

  @Get(':id')
  get(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.puzzleMaintenanceService.get(req.user.escapeVenueId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { escapeVenueId: string } },
    @Body() dto: CreatePuzzleMaintenanceDto,
  ) {
    return this.puzzleMaintenanceService.create(req.user.escapeVenueId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { escapeVenueId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePuzzleMaintenanceDto,
  ) {
    return this.puzzleMaintenanceService.update(req.user.escapeVenueId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.puzzleMaintenanceService.remove(req.user.escapeVenueId, id);
  }
}
