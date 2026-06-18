import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const STUDIO_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.resinStudio.upsert({
    where: { id: STUDIO_ID },
    update: {},
    create: {
      id: STUDIO_ID,
      name: 'Iridescent Pour Studio',
      phone: '+13125550142',
      address: '2840 North Milwaukee Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60618',
      totalWorkstations: 6,
      timezone: 'America/Chicago',
      users: {
        create: {
          email: 'demo@iridescentpourstudio.com',
          passwordHash,
          firstName: 'Elif',
          lastName: 'Kara',
          role: 'owner',
        },
      },
    },
  });

  const workstationData = [
    {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'İstasyon A — Standart',
      zone: 'Ana Atölye',
      workstationType: 'standard' as const,
      workstationModel: 'ProMarine Table Top Pro',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'İstasyon B — Premium',
      zone: 'Ana Atölye',
      workstationType: 'premium' as const,
      workstationModel: 'Stone Coat Countertop',
      status: 'pouring' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'İstasyon C — Vakum',
      zone: 'Laboratuvar',
      workstationType: 'vacuum_chamber' as const,
      workstationModel: 'BestValueVac 5 Gallon',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      name: 'İstasyon D — Basınç',
      zone: 'Laboratuvar',
      workstationType: 'pressure_pot' as const,
      workstationModel: 'California Air 10L Pot',
      status: 'curing' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      name: 'Test İstasyonu',
      zone: 'Test Alanı',
      workstationType: 'studio' as const,
      workstationModel: 'ArtResin Starter Kit',
      status: 'maintenance' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000106',
      name: 'Kürleme İstasyonu',
      zone: 'Kürleme Odası',
      workstationType: 'standard' as const,
      workstationModel: 'Humidity-Controlled Bay',
      status: 'offline' as const,
    },
  ];

  const workstations = [];
  for (const workstation of workstationData) {
    const created = await prisma.workstation.upsert({
      where: { id: workstation.id },
      update: {},
      create: { ...workstation, resinStudioId: STUDIO_ID },
    });
    workstations.push(created);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.pourBatch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      resinStudioId: STUDIO_ID,
      workstationId: workstations[1].id,
      scheduledAt: yesterday,
      pouringType: 'river_table',
      cashAmount: 0,
      cardAmount: 485.0,
      pieceCount: 1,
      hardenerRatio: 1.0,
      status: 'completed',
      notes: 'Nehrin ortası ahşap masa — mavi pigment',
    },
  });

  await prisma.pourBatch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      resinStudioId: STUDIO_ID,
      workstationId: workstations[0].id,
      scheduledAt: new Date(),
      pouringType: 'countertop',
      cashAmount: 120.0,
      cardAmount: 0,
      pieceCount: 8,
      hardenerRatio: 1.0,
      status: 'in_progress',
      notes: 'Tezgah üstü coaster seti — altın yaprak',
    },
  });

  await prisma.equipmentRepair.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      resinStudioId: STUDIO_ID,
      workstationId: workstations[4].id,
      title: 'Vakum pompası contası',
      description: 'Vakum odası contası yıpranmış, değiştirilmeli',
      reportedAt: new Date(),
      priority: 'urgent',
      status: 'open',
      cost: 95.0,
    },
  });

  await prisma.equipmentRepair.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      resinStudioId: STUDIO_ID,
      workstationId: workstations[0].id,
      title: 'Karıştırıcı motor bakımı',
      description: 'Yıllık rutin karıştırıcı motor kontrolü',
      reportedAt: new Date(),
      priority: 'medium',
      status: 'in_progress',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  await prisma.curingChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      resinStudioId: STUDIO_ID,
      title: 'Nem oranı kontrolü',
      description: 'Kürleme odası %45 nem hedefi doğrulanacak',
      category: 'humidity_check',
      zone: 'Kürleme Odası',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.curingChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      resinStudioId: STUDIO_ID,
      title: 'Sıcaklık log kaydı',
      category: 'temperature_log',
      zone: 'Laboratuvar',
      scheduledAt: new Date(),
      status: 'in_progress',
    },
  });

  await prisma.workshopRate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      resinStudioId: STUDIO_ID,
      title: 'Döküm Seansı — Standart',
      rateCategory: 'pour_session',
      status: 'active',
      basePrice: 65.0,
      priceMultiplier: 1.0,
      notes: 'Saatlik, malzeme hariç',
    },
  });

  await prisma.workshopRate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      resinStudioId: STUDIO_ID,
      title: 'Atölye Sınıfı — Nehir Masası',
      rateCategory: 'class_rental',
      status: 'active',
      basePrice: 125.0,
      priceMultiplier: 1.5,
      notes: 'Hafta sonu grup atölyesi',
    },
  });

  await prisma.moldOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000601' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000601',
      resinStudioId: STUDIO_ID,
      customerName: 'Sarah Mitchell',
      moldType: 'Geode Coaster Set — 6 adet',
      supplierName: 'Silicone Mold Supply',
      status: 'pending',
      price: 180.0,
      notes: 'Özel boyut: 10cm çap',
    },
  });

  await prisma.moldOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000602' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000602',
      resinStudioId: STUDIO_ID,
      customerName: 'James Park',
      moldType: 'River Table Mold — 48 inch',
      supplierName: 'Custom Mold Works',
      status: 'in_progress',
      price: 420.0,
    },
  });

  console.log('ResinPulse seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
