import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    resinStudio: { findUnique: jest.fn() },
    workstation: { count: jest.fn(), groupBy: jest.fn() },
    pourBatch: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    equipmentRepair: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    curingChecklist: { count: jest.fn() },
    workshopRate: { count: jest.fn() },
    moldOrder: { count: jest.fn() },
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

  it('should return artisaning shop dashboard stats', async () => {
    mockPrisma.resinStudio.findUnique.mockResolvedValue({ totalWorkstations: 8 });
    mockPrisma.workstation.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.pourBatch.count.mockResolvedValue(42);
    mockPrisma.equipmentRepair.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mockPrisma.pourBatch.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, hardenerRatio: 95 },
    });
    mockPrisma.pourBatch.findMany.mockResolvedValue([]);
    mockPrisma.equipmentRepair.findMany.mockResolvedValue([]);
    mockPrisma.curingChecklist.count.mockResolvedValue(2);
    mockPrisma.workshopRate.count.mockResolvedValue(3);
    mockPrisma.moldOrder.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.workstation.groupBy.mockResolvedValue([
      { zone: 'East Zone', _count: { id: 3 } },
      { zone: 'West Zone', _count: { id: 3 } },
    ]);

    const stats = await service.getStats('shop-1');

    expect(stats).toHaveProperty('workstationUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyConeAdjustments', 95);
    expect(stats).toHaveProperty('studioZones');
    expect(stats).toHaveProperty('urgentEquipmentRepair');
    expect(stats).toHaveProperty('pendingCuringChecklist');
    expect(stats).toHaveProperty('activeWorkshopRates', 3);
    expect(stats).toHaveProperty('pendingMoldOrders', 3);
    expect(stats).toHaveProperty('completedMoldOrders', 2);
    expect(stats).toHaveProperty('availableWorkstations', 4);
    expect(stats).toHaveProperty('totalWorkstations', 8);
  });
});
