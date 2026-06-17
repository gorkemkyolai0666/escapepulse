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
import { ResetChecklistService } from './reset-checklists.service';
import { CreateResetChecklistDto, UpdateResetChecklistDto } from './dto/reset-checklist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reset-checklists')
@UseGuards(JwtAuthGuard)
export class ResetChecklistController {
  constructor(private resetChecklistService: ResetChecklistService) {}

  @Get()
  list(
    @Request() req: { user: { escapeVenueId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.resetChecklistService.list(req.user.escapeVenueId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.resetChecklistService.get(req.user.escapeVenueId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { escapeVenueId: string } },
    @Body() dto: CreateResetChecklistDto,
  ) {
    return this.resetChecklistService.create(req.user.escapeVenueId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { escapeVenueId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateResetChecklistDto,
  ) {
    return this.resetChecklistService.update(req.user.escapeVenueId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.resetChecklistService.remove(req.user.escapeVenueId, id);
  }
}
