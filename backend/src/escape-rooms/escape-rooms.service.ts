import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEscapeRoomDto, UpdateEscapeRoomDto } from './dto/escape-room.dto';

@Injectable()
export class EscapeRoomsService {
  constructor(private prisma: PrismaService) {}

  async list(escapeVenueId: string, params: { page?: number; status?: string; wing?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { escapeVenueId };
    if (params.status) where.status = params.status;
    if (params.wing) where.wing = params.wing;

    const [data, total] = await Promise.all([
      this.prisma.escapeRoom.findMany({
        where,
        orderBy: [{ wing: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          puzzleMaintenance: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.escapeRoom.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(escapeVenueId: string, id: string) {
    const court = await this.prisma.escapeRoom.findFirst({
      where: { id, escapeVenueId },
      include: {
        puzzleMaintenance: { orderBy: { reportedAt: 'desc' }, take: 5 },
        gameSessions: { orderBy: { sessionAt: 'desc' }, take: 5 },
      },
    });
    if (!court) throw new NotFoundException('Oda bulunamadı');
    return court;
  }

  async create(escapeVenueId: string, dto: CreateEscapeRoomDto) {
    return this.prisma.escapeRoom.create({ data: { ...dto, escapeVenueId } });
  }

  async update(escapeVenueId: string, id: string, dto: UpdateEscapeRoomDto) {
    await this.get(escapeVenueId, id);
    return this.prisma.escapeRoom.update({ where: { id }, data: dto });
  }

  async remove(escapeVenueId: string, id: string) {
    await this.get(escapeVenueId, id);
    return this.prisma.escapeRoom.delete({ where: { id } });
  }
}
