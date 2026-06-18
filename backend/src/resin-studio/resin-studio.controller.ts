import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ResinStudioService } from './resin-studio.service';
import { UpdateResinStudioDto } from './dto/update-resin-studio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resin-studio')
@UseGuards(JwtAuthGuard)
export class ResinStudioController {
  constructor(private resinStudioService: ResinStudioService) {}

  @Get()
  get(@Request() req: { user: { resinStudioId: string } }) {
    return this.resinStudioService.get(req.user.resinStudioId);
  }

  @Patch()
  update(
    @Request() req: { user: { resinStudioId: string } },
    @Body() dto: UpdateResinStudioDto,
  ) {
    return this.resinStudioService.update(req.user.resinStudioId, dto);
  }
}
