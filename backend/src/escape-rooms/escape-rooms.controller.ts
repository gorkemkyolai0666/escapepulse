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
import { EscapeRoomsService } from './escape-rooms.service';
import { CreateEscapeRoomDto, UpdateEscapeRoomDto } from './dto/escape-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('escape-rooms')
@UseGuards(JwtAuthGuard)
export class EscapeRoomsController {
  constructor(private escapeRoomsService: EscapeRoomsService) {}

  @Get()
  list(
    @Request() req: { user: { escapeVenueId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('wing') wing?: string,
  ) {
    return this.escapeRoomsService.list(req.user.escapeVenueId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      wing,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.escapeRoomsService.get(req.user.escapeVenueId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { escapeVenueId: string } },
    @Body() dto: CreateEscapeRoomDto,
  ) {
    return this.escapeRoomsService.create(req.user.escapeVenueId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { escapeVenueId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateEscapeRoomDto,
  ) {
    return this.escapeRoomsService.update(req.user.escapeVenueId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.escapeRoomsService.remove(req.user.escapeVenueId, id);
  }
}
