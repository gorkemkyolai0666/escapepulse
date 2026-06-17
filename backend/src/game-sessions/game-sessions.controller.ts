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
import { GameSessionsService } from './game-sessions.service';
import { CreateGameSessionDto, UpdateGameSessionDto } from './dto/game-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('game-sessions')
@UseGuards(JwtAuthGuard)
export class GameSessionsController {
  constructor(private gameSessionsService: GameSessionsService) {}

  @Get()
  list(
    @Request() req: { user: { escapeVenueId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.gameSessionsService.list(req.user.escapeVenueId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.gameSessionsService.get(req.user.escapeVenueId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { escapeVenueId: string } },
    @Body() dto: CreateGameSessionDto,
  ) {
    return this.gameSessionsService.create(req.user.escapeVenueId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { escapeVenueId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateGameSessionDto,
  ) {
    return this.gameSessionsService.update(req.user.escapeVenueId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.gameSessionsService.remove(req.user.escapeVenueId, id);
  }
}
