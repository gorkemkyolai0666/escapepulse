import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEscapeVenueDto } from './dto/update-escape-venue.dto';

@Injectable()
export class EscapeVenueService {
  constructor(private prisma: PrismaService) {}

  async get(escapeVenueId: string) {
    const escapeVenue = await this.prisma.escapeVenue.findUnique({
      where: { id: escapeVenueId },
    });
    if (!escapeVenue) throw new NotFoundException('Tenis kulübü bulunamadı');
    return escapeVenue;
  }

  async update(escapeVenueId: string, dto: UpdateEscapeVenueDto) {
    await this.get(escapeVenueId);
    return this.prisma.escapeVenue.update({ where: { id: escapeVenueId }, data: dto });
  }
}
