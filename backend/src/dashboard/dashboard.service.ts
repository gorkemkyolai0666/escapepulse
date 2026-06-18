import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(resinStudioId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      resinStudio,
      totalWorkstations,
      availableWorkstations,
      pouringWorkstations,
      totalBatches,
      openEquipmentRepair,
      urgentEquipmentRepair,
      pendingCuringChecklist,
      activeWorkshopRates,
      pendingMoldOrders,
      completedMoldOrders,
      revenueTotals,
      recentBatches,
      recentEquipmentRepair,
      studioZones,
    ] = await Promise.all([
      this.prisma.resinStudio.findUnique({ where: { id: resinStudioId } }),
      this.prisma.workstation.count({ where: { resinStudioId } }),
      this.prisma.workstation.count({ where: { resinStudioId, status: 'available' } }),
      this.prisma.workstation.count({ where: { resinStudioId, status: 'pouring' } }),
      this.prisma.pourBatch.count({ where: { resinStudioId } }),
      this.prisma.equipmentRepair.count({
        where: { resinStudioId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.equipmentRepair.count({
        where: {
          resinStudioId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.curingChecklist.count({
        where: {
          resinStudioId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.workshopRate.count({
        where: { resinStudioId, status: 'active' },
      }),
      this.prisma.moldOrder.count({
        where: { resinStudioId, status: { in: ['pending', 'in_progress'] } },
      }),
      this.prisma.moldOrder.count({
        where: { resinStudioId, status: { in: ['completed', 'delivered'] } },
      }),
      this.prisma.pourBatch.aggregate({
        where: { resinStudioId, scheduledAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, hardenerRatio: true },
      }),
      this.prisma.pourBatch.findMany({
        where: { resinStudioId },
        include: {
          workstation: { select: { name: true, zone: true, workstationType: true } },
        },
        orderBy: { scheduledAt: 'desc' },
        take: 5,
      }),
      this.prisma.equipmentRepair.findMany({
        where: { resinStudioId, status: { in: ['open', 'in_progress'] } },
        include: {
          workstation: { select: { name: true, zone: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.workstation.groupBy({
        by: ['zone'],
        where: { resinStudioId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = resinStudio?.totalWorkstations || totalWorkstations || 1;
    const workstationUtilizationRate =
      totalWorkstations > 0 ? Math.round((pouringWorkstations / totalWorkstations) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.hardenerRatio || 0);

    const dailyConeAdjustments = revenueTotals._sum.hardenerRatio || 0;

    const monthlyTrend = await this.getMonthlyTrend(resinStudioId, sixMonthsAgo);

    return {
      totalWorkstations,
      availableWorkstations,
      pouringWorkstations,
      totalCapacity,
      workstationUtilizationRate,
      totalBatches,
      openEquipmentRepair,
      urgentEquipmentRepair,
      pendingCuringChecklist,
      activeWorkshopRates,
      pendingMoldOrders,
      completedMoldOrders,
      dailyRevenue,
      dailyConeAdjustments,
      recentBatches,
      recentEquipmentRepair,
      studioZones: studioZones.map((w) => ({
        zone: w.zone,
        workstationCount: w._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(resinStudioId: string, since: Date) {
    const sessions = await this.prisma.pourBatch.findMany({
      where: { resinStudioId, scheduledAt: { gte: since } },
      select: {
        scheduledAt: true,
        cashAmount: true,
        cardAmount: true,
        hardenerRatio: true,
        pieceCount: true,
      },
    });

    const months: Record<string, { games: number; revenue: number; pieceCount: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { games: 0, revenue: 0, pieceCount: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.scheduledAt.getFullYear()}-${String(session.scheduledAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].games++;
        months[key].revenue +=
          session.cashAmount + session.cardAmount + session.hardenerRatio;
        months[key].pieceCount += session.pieceCount;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
