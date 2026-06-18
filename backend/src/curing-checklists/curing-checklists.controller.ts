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
import { CuringChecklistService } from './curing-checklists.service';
import { CreateCuringChecklistDto, UpdateCuringChecklistDto } from './dto/curing-checklist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('curing-checklists')
@UseGuards(JwtAuthGuard)
export class CuringChecklistController {
  constructor(private curingChecklistService: CuringChecklistService) {}

  @Get()
  list(
    @Request() req: { user: { resinStudioId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.curingChecklistService.list(req.user.resinStudioId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.curingChecklistService.get(req.user.resinStudioId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { resinStudioId: string } },
    @Body() dto: CreateCuringChecklistDto,
  ) {
    return this.curingChecklistService.create(req.user.resinStudioId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { resinStudioId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCuringChecklistDto,
  ) {
    return this.curingChecklistService.update(req.user.resinStudioId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.curingChecklistService.remove(req.user.resinStudioId, id);
  }
}
