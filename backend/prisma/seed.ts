import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ESCAPE_VENUE_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.escapeVenue.upsert({
    where: { id: ESCAPE_VENUE_ID },
    update: {},
    create: {
      id: ESCAPE_VENUE_ID,
      name: 'Mystery Manor Escapes',
      phone: '+13125550142',
      address: '88 Shadow Lane',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60614',
      totalRooms: 6,
      timezone: 'America/Chicago',
      users: {
        create: {
          email: 'demo@mysterymanorescapes.com',
          passwordHash,
          firstName: 'Elif',
          lastName: 'Kara',
          role: 'owner',
        },
      },
    },
  });

  const roomData = [
    { id: '00000000-0000-0000-0000-000000000101', name: 'The Crypt', wing: 'Basement Wing', theme: 'horror' as const, puzzleMechanism: 'RFID lock chain + pressure plates', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000102', name: 'Vanishing Study', wing: 'Basement Wing', theme: 'mystery' as const, puzzleMechanism: 'Magnetic compass + cipher wheel', status: 'in_game' as const },
    { id: '00000000-0000-0000-0000-000000000103', name: 'Starship Bridge', wing: 'Upper Floor', theme: 'sci_fi' as const, puzzleMechanism: 'Arduino control panel + laser maze', status: 'available' as const },
    { id: '00000000-0000-0000-0000-000000000104', name: 'Pirate Cove', wing: 'Upper Floor', theme: 'adventure' as const, puzzleMechanism: 'Treasure map UV reveal + pulley system', status: 'resetting' as const },
    { id: '00000000-0000-0000-0000-000000000105', name: 'Medieval Dungeon', wing: 'Annex', theme: 'historical' as const, puzzleMechanism: null, status: 'maintenance' as const },
    { id: '00000000-0000-0000-0000-000000000106', name: 'Enchanted Forest', wing: 'Annex', theme: 'fantasy' as const, puzzleMechanism: 'Sound-reactive crystal nodes', status: 'closed' as const },
  ];

  const rooms = [];
  for (const room of roomData) {
    const created = await prisma.escapeRoom.upsert({
      where: { id: room.id },
      update: {},
      create: { ...room, escapeVenueId: ESCAPE_VENUE_ID },
    });
    rooms.push(created);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.gameSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      escapeVenueId: ESCAPE_VENUE_ID,
      escapeRoomId: rooms[2].id,
      sessionAt: yesterday,
      gameType: 'corporate',
      cashAmount: 0,
      cardAmount: 1240.0,
      participants: 8,
      addOnRevenue: 180.0,
      status: 'verified',
    },
  });

  await prisma.gameSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      escapeVenueId: ESCAPE_VENUE_ID,
      escapeRoomId: rooms[1].id,
      sessionAt: yesterday,
      gameType: 'date_night',
      cashAmount: 45.0,
      cardAmount: 285.0,
      participants: 2,
      addOnRevenue: 35.0,
      status: 'verified',
    },
  });

  const reportedAt = new Date();
  reportedAt.setDate(reportedAt.getDate() - 2);

  await prisma.puzzleMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      escapeVenueId: ESCAPE_VENUE_ID,
      escapeRoomId: rooms[4].id,
      title: 'Kilit mekanizması arızası — Medieval Dungeon',
      description: 'Ana kapı RFID okuyucu yanıt vermiyor',
      reportedAt,
      priority: 'urgent',
      status: 'open',
      cost: null,
    },
  });

  await prisma.puzzleMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      escapeVenueId: ESCAPE_VENUE_ID,
      escapeRoomId: rooms[1].id,
      title: 'Şifre çarkı kalibrasyonu — Vanishing Study',
      description: 'Son oturumda çark sıkıştı',
      reportedAt,
      priority: 'medium',
      status: 'in_progress',
      cost: 75.0,
    },
  });

  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 2);

  await prisma.resetChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      escapeVenueId: ESCAPE_VENUE_ID,
      title: 'Tam sıfırlama — Starship Bridge',
      description: 'Tüm ipuçlarını yeniden yerleştir, kontrol panelini sıfırla',
      category: 'full_reset',
      wing: 'Upper Floor',
      scheduledAt,
      status: 'scheduled',
    },
  });

  await prisma.resetChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      escapeVenueId: ESCAPE_VENUE_ID,
      title: 'Prop kontrolü — The Crypt',
      category: 'prop_check',
      wing: 'Basement Wing',
      scheduledAt,
      status: 'scheduled',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      escapeVenueId: ESCAPE_VENUE_ID,
      title: 'Standart Oda Kiralama',
      rateCategory: 'room_booking',
      status: 'active',
      basePrice: 32.0,
      priceMultiplier: 1.0,
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      escapeVenueId: ESCAPE_VENUE_ID,
      title: 'Kurumsal Etkinlik Paketi',
      rateCategory: 'corporate_event',
      status: 'active',
      basePrice: 28.0,
      priceMultiplier: 0.85,
      notes: '8+ kişilik gruplar için kişi başı indirim',
    },
  });

  await prisma.propOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000601' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000601',
      escapeVenueId: ESCAPE_VENUE_ID,
      customerName: 'Escape Props Co.',
      propCategory: 'RFID Lock Set',
      supplierName: 'Escape Props Co.',
      status: 'pending',
      price: 245.0,
      notes: 'Medieval Dungeon yedek kilit seti',
    },
  });

  await prisma.propOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000602' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000602',
      escapeVenueId: ESCAPE_VENUE_ID,
      customerName: 'PuzzleCraft Supply',
      propCategory: 'Cipher Wheel',
      supplierName: 'PuzzleCraft Supply',
      status: 'in_progress',
      price: 89.0,
    },
  });

  console.log('Seed completed: Mystery Manor Escapes');
  console.log('Demo: demo@mysterymanorescapes.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
