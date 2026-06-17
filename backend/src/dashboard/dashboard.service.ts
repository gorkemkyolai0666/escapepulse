import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(escapeVenueId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      escapeVenue,
      totalRooms,
      availableRooms,
      inGameRooms,
      totalGames,
      openPuzzleMaintenance,
      urgentPuzzleMaintenance,
      pendingResetChecklist,
      activeRateTiers,
      pendingPropOrders,
      completedPropOrders,
      revenueTotals,
      recentGames,
      recentPuzzleMaintenance,
      roomWings,
    ] = await Promise.all([
      this.prisma.escapeVenue.findUnique({ where: { id: escapeVenueId } }),
      this.prisma.escapeRoom.count({ where: { escapeVenueId } }),
      this.prisma.escapeRoom.count({ where: { escapeVenueId, status: 'available' } }),
      this.prisma.escapeRoom.count({ where: { escapeVenueId, status: 'in_game' } }),
      this.prisma.gameSession.count({ where: { escapeVenueId } }),
      this.prisma.puzzleMaintenance.count({
        where: { escapeVenueId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.puzzleMaintenance.count({
        where: {
          escapeVenueId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.resetChecklist.count({
        where: {
          escapeVenueId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.rateTier.count({
        where: { escapeVenueId, status: 'active' },
      }),
      this.prisma.propOrder.count({
        where: { escapeVenueId, status: { in: ['pending', 'in_progress'] } },
      }),
      this.prisma.propOrder.count({
        where: { escapeVenueId, status: { in: ['completed', 'delivered'] } },
      }),
      this.prisma.gameSession.aggregate({
        where: { escapeVenueId, sessionAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, addOnRevenue: true },
      }),
      this.prisma.gameSession.findMany({
        where: { escapeVenueId },
        include: {
          escapeRoom: { select: { name: true, wing: true, theme: true } },
        },
        orderBy: { sessionAt: 'desc' },
        take: 5,
      }),
      this.prisma.puzzleMaintenance.findMany({
        where: { escapeVenueId, status: { in: ['open', 'in_progress'] } },
        include: {
          escapeRoom: { select: { name: true, wing: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.escapeRoom.groupBy({
        by: ['wing'],
        where: { escapeVenueId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = escapeVenue?.totalRooms || totalRooms || 1;
    const roomUtilizationRate =
      totalRooms > 0 ? Math.round((inGameRooms / totalRooms) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.addOnRevenue || 0);

    const dailyAddOnRevenue = revenueTotals._sum.addOnRevenue || 0;

    const monthlyTrend = await this.getMonthlyTrend(escapeVenueId, sixMonthsAgo);

    return {
      totalRooms,
      availableRooms,
      inGameRooms,
      totalCapacity,
      roomUtilizationRate,
      totalGames,
      openPuzzleMaintenance,
      urgentPuzzleMaintenance,
      pendingResetChecklist,
      activeRateTiers,
      pendingPropOrders,
      completedPropOrders,
      dailyRevenue,
      dailyAddOnRevenue,
      recentGames,
      recentPuzzleMaintenance,
      roomWings: roomWings.map((w) => ({
        wing: w.wing,
        roomCount: w._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(escapeVenueId: string, since: Date) {
    const sessions = await this.prisma.gameSession.findMany({
      where: { escapeVenueId, sessionAt: { gte: since } },
      select: {
        sessionAt: true,
        cashAmount: true,
        cardAmount: true,
        addOnRevenue: true,
        participants: true,
      },
    });

    const months: Record<string, { games: number; revenue: number; participants: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { games: 0, revenue: 0, participants: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.sessionAt.getFullYear()}-${String(session.sessionAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].games++;
        months[key].revenue +=
          session.cashAmount + session.cardAmount + session.addOnRevenue;
        months[key].participants += session.participants;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
