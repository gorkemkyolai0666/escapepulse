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
import { WorkshopRatesService } from './workshop-rates.service';
import { CreateWorkshopRateDto, UpdateWorkshopRateDto } from './dto/workshop-rate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workshop-rates')
@UseGuards(JwtAuthGuard)
export class WorkshopRatesController {
  constructor(private workshopRatesService: WorkshopRatesService) {}

  @Get()
  list(
    @Request() req: { user: { resinStudioId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.workshopRatesService.list(req.user.resinStudioId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.workshopRatesService.get(req.user.resinStudioId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { resinStudioId: string } },
    @Body() dto: CreateWorkshopRateDto,
  ) {
    return this.workshopRatesService.create(req.user.resinStudioId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { resinStudioId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateWorkshopRateDto,
  ) {
    return this.workshopRatesService.update(req.user.resinStudioId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.workshopRatesService.remove(req.user.resinStudioId, id);
  }
}
