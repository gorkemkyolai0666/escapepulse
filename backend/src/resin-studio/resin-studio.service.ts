import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateResinStudioDto } from './dto/update-resin-studio.dto';

@Injectable()
export class ResinStudioService {
  constructor(private prisma: PrismaService) {}

  async get(resinStudioId: string) {
    const resinStudio = await this.prisma.resinStudio.findUnique({ where: { id: resinStudioId } });
    if (!resinStudio) throw new NotFoundException('Tenis kulubu bulunamadi');
    return resinStudio;
  }

  async update(resinStudioId: string, dto: UpdateResinStudioDto) {
    await this.get(resinStudioId);
    return this.prisma.resinStudio.update({ where: { id: resinStudioId }, data: dto });
  }
}
