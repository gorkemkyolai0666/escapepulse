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
import { PropOrdersService } from './prop-orders.service';
import { CreatePropOrderDto, UpdatePropOrderDto } from './dto/prop-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prop-orders')
@UseGuards(JwtAuthGuard)
export class PropOrdersController {
  constructor(private propOrdersService: PropOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { escapeVenueId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('propCategory') propCategory?: string,
  ) {
    return this.propOrdersService.list(req.user.escapeVenueId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      propCategory,
    });
  }

  @Get('pending')
  pending(@Request() req: { user: { escapeVenueId: string } }) {
    return this.propOrdersService.pending(req.user.escapeVenueId);
  }

  @Get(':id')
  get(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.propOrdersService.get(req.user.escapeVenueId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { escapeVenueId: string } },
    @Body() dto: CreatePropOrderDto,
  ) {
    return this.propOrdersService.create(req.user.escapeVenueId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { escapeVenueId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePropOrderDto,
  ) {
    return this.propOrdersService.update(req.user.escapeVenueId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { escapeVenueId: string } }, @Param('id') id: string) {
    return this.propOrdersService.remove(req.user.escapeVenueId, id);
  }
}
