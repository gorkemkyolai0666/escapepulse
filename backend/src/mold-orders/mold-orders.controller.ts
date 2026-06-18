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
import { MoldOrdersService } from './mold-orders.service';
import { CreateMoldOrderDto, UpdateMoldOrderDto } from './dto/mold-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mold-orders')
@UseGuards(JwtAuthGuard)
export class MoldOrdersController {
  constructor(private moldOrdersService: MoldOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { resinStudioId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('moldType') moldType?: string,
  ) {
    return this.moldOrdersService.list(req.user.resinStudioId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      moldType,
    });
  }

  @Get('pending')
  pending(@Request() req: { user: { resinStudioId: string } }) {
    return this.moldOrdersService.pending(req.user.resinStudioId);
  }

  @Get(':id')
  get(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.moldOrdersService.get(req.user.resinStudioId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { resinStudioId: string } },
    @Body() dto: CreateMoldOrderDto,
  ) {
    return this.moldOrdersService.create(req.user.resinStudioId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { resinStudioId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateMoldOrderDto,
  ) {
    return this.moldOrdersService.update(req.user.resinStudioId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.moldOrdersService.remove(req.user.resinStudioId, id);
  }
}
