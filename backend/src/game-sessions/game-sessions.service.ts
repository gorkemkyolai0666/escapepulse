import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameSessionDto, UpdateGameSessionDto } from './dto/game-session.dto';

@Injectable()
export class GameSessionsService {
  constructor(private prisma: PrismaService) {}

  async list(escapeVenueId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { escapeVenueId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.gameSession.findMany({
        where,
        orderBy: { sessionAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          escapeRoom: { select: { id: true, name: true, wing: true, theme: true } },
        },
      }),
      this.prisma.gameSession.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(escapeVenueId: string, id: string) {
    const session = await this.prisma.gameSession.findFirst({
      where: { id, escapeVenueId },
      include: { escapeRoom: true },
    });
    if (!session) throw new NotFoundException('Ders oturumu bulunamadı');
    return session;
  }

  async create(escapeVenueId: string, dto: CreateGameSessionDto) {
    return this.prisma.gameSession.create({
      data: {
        ...dto,
        escapeVenueId,
        sessionAt: dto.sessionAt ? new Date(dto.sessionAt) : new Date(),
      },
      include: { escapeRoom: true },
    });
  }

  async update(escapeVenueId: string, id: string, dto: UpdateGameSessionDto) {
    await this.get(escapeVenueId, id);
    const data = { ...dto };
    if (dto.sessionAt) {
      (data as { sessionAt?: Date }).sessionAt = new Date(dto.sessionAt);
    }
    return this.prisma.gameSession.update({
      where: { id },
      data,
      include: { escapeRoom: true },
    });
  }

  async remove(escapeVenueId: string, id: string) {
    await this.get(escapeVenueId, id);
    return this.prisma.gameSession.delete({ where: { id } });
  }
}
