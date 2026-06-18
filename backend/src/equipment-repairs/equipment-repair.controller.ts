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
import { EquipmentRepairService } from './equipment-repair.service';
import {
  CreateEquipmentRepairDto,
  UpdateEquipmentRepairDto,
} from './dto/equipment-repair.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipment-repairs')
@UseGuards(JwtAuthGuard)
export class EquipmentRepairController {
  constructor(private equipmentRepairService: EquipmentRepairService) {}

  @Get()
  list(
    @Request() req: { user: { resinStudioId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.equipmentRepairService.list(req.user.resinStudioId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { resinStudioId: string } }) {
    return this.equipmentRepairService.urgent(req.user.resinStudioId);
  }

  @Get(':id')
  get(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.equipmentRepairService.get(req.user.resinStudioId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { resinStudioId: string } },
    @Body() dto: CreateEquipmentRepairDto,
  ) {
    return this.equipmentRepairService.create(req.user.resinStudioId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { resinStudioId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentRepairDto,
  ) {
    return this.equipmentRepairService.update(req.user.resinStudioId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { resinStudioId: string } }, @Param('id') id: string) {
    return this.equipmentRepairService.remove(req.user.resinStudioId, id);
  }
}
