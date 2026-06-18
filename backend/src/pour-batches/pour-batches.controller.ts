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
import { PourBatchesService } from './pour-batches.service';
import { CreatePourBatchDto, UpdatePourBatchDto } from './dto/pour-batch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pour-batches')
@UseGuards(JwtAuthGuard)
export class PourBatchesController {
  constructor(private pourBatchesService: PourBatchesService) {}

  @Get()
  list(
    @Request() req: { user: { resinStudioId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.pourBatchesService.list(req.user.resinStudioId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.pourBatchesService.get(req.user.resinStudioId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { resinStudioId: string } },
    @Body() dto: CreatePourBatchDto,
  ) {
    return this.pourBatchesService.create(req.user.resinStudioId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { resinStudioId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePourBatchDto,
  ) {
    return this.pourBatchesService.update(req.user.resinStudioId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.pourBatchesService.remove(req.user.resinStudioId, id);
  }
}
