import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    escapeVenue: { findUnique: jest.fn() },
    escapeRoom: { count: jest.fn(), groupBy: jest.fn() },
    gameSession: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    puzzleMaintenance: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    resetChecklist: { count: jest.fn() },
    rateTier: { count: jest.fn() },
    propOrder: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return tennis club dashboard stats', async () => {
    mockPrisma.escapeVenue.findUnique.mockResolvedValue({ totalRooms: 8 });
    mockPrisma.escapeRoom.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.gameSession.count.mockResolvedValue(42);
    mockPrisma.puzzleMaintenance.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mockPrisma.gameSession.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, addOnRevenue: 95 },
    });
    mockPrisma.gameSession.findMany.mockResolvedValue([]);
    mockPrisma.puzzleMaintenance.findMany.mockResolvedValue([]);
    mockPrisma.resetChecklist.count.mockResolvedValue(2);
    mockPrisma.rateTier.count.mockResolvedValue(3);
    mockPrisma.propOrder.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.escapeRoom.groupBy.mockResolvedValue([
      { wing: 'East Wing', _count: { id: 3 } },
      { wing: 'West Wing', _count: { id: 3 } },
    ]);

    const stats = await service.getStats('tennis-club-1');

    expect(stats).toHaveProperty('roomUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyAddOnRevenue', 95);
    expect(stats).toHaveProperty('roomWings');
    expect(stats).toHaveProperty('urgentPuzzleMaintenance');
    expect(stats).toHaveProperty('pendingResetChecklist');
    expect(stats).toHaveProperty('activeRateTiers', 3);
    expect(stats).toHaveProperty('pendingPropOrders', 3);
    expect(stats).toHaveProperty('completedPropOrders', 2);
    expect(stats).toHaveProperty('availableRooms', 4);
    expect(stats).toHaveProperty('totalRooms', 8);
  });
});
