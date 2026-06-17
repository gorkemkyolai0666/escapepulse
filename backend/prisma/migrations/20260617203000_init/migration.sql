-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'game_master');

-- CreateEnum
CREATE TYPE "RoomTheme" AS ENUM ('horror', 'mystery', 'sci_fi', 'historical', 'fantasy', 'adventure');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('available', 'in_game', 'resetting', 'maintenance', 'closed');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('private_group', 'corporate', 'birthday', 'date_night', 'team_building');

-- CreateEnum
CREATE TYPE "PuzzlePriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "PuzzleStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ResetCategory" AS ENUM ('full_reset', 'prop_check', 'clue_refresh', 'lock_repair', 'lighting', 'other');

-- CreateEnum
CREATE TYPE "ResetStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "RateCategory" AS ENUM ('room_booking', 'corporate_event', 'birthday_package', 'team_building', 'peak_hour', 'other');

-- CreateEnum
CREATE TYPE "RateStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "PropOrderStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered');

-- CreateTable
CREATE TABLE "escape_venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_rooms" INTEGER NOT NULL DEFAULT 6,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escape_venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "escape_venue_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escape_rooms" (
    "id" TEXT NOT NULL,
    "escape_venue_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wing" TEXT NOT NULL,
    "theme" "RoomTheme" NOT NULL DEFAULT 'mystery',
    "puzzle_mechanism" TEXT,
    "status" "RoomStatus" NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escape_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" TEXT NOT NULL,
    "escape_venue_id" TEXT NOT NULL,
    "escape_room_id" TEXT NOT NULL,
    "session_at" TIMESTAMP(3) NOT NULL,
    "game_type" "GameType" NOT NULL DEFAULT 'private_group',
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "add_on_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puzzle_maintenance" (
    "id" TEXT NOT NULL,
    "escape_venue_id" TEXT NOT NULL,
    "escape_room_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "PuzzlePriority" NOT NULL DEFAULT 'medium',
    "status" "PuzzleStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "puzzle_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_checklists" (
    "id" TEXT NOT NULL,
    "escape_venue_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ResetCategory" NOT NULL DEFAULT 'other',
    "wing" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "ResetStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reset_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_tiers" (
    "id" TEXT NOT NULL,
    "escape_venue_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rate_category" "RateCategory" NOT NULL DEFAULT 'room_booking',
    "status" "RateStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prop_orders" (
    "id" TEXT NOT NULL,
    "escape_venue_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "prop_category" TEXT NOT NULL,
    "supplier_name" TEXT,
    "status" "PropOrderStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prop_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "escape_rooms_escape_venue_id_name_key" ON "escape_rooms"("escape_venue_id", "name");

-- CreateIndex
CREATE INDEX "escape_rooms_escape_venue_id_status_idx" ON "escape_rooms"("escape_venue_id", "status");

-- CreateIndex
CREATE INDEX "game_sessions_escape_venue_id_session_at_idx" ON "game_sessions"("escape_venue_id", "session_at");

-- CreateIndex
CREATE INDEX "game_sessions_escape_venue_id_status_idx" ON "game_sessions"("escape_venue_id", "status");

-- CreateIndex
CREATE INDEX "puzzle_maintenance_escape_venue_id_status_idx" ON "puzzle_maintenance"("escape_venue_id", "status");

-- CreateIndex
CREATE INDEX "puzzle_maintenance_escape_venue_id_priority_idx" ON "puzzle_maintenance"("escape_venue_id", "priority");

-- CreateIndex
CREATE INDEX "reset_checklists_escape_venue_id_scheduled_at_idx" ON "reset_checklists"("escape_venue_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "rate_tiers_escape_venue_id_rate_category_idx" ON "rate_tiers"("escape_venue_id", "rate_category");

-- CreateIndex
CREATE INDEX "prop_orders_escape_venue_id_status_idx" ON "prop_orders"("escape_venue_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_escape_venue_id_fkey" FOREIGN KEY ("escape_venue_id") REFERENCES "escape_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escape_rooms" ADD CONSTRAINT "escape_rooms_escape_venue_id_fkey" FOREIGN KEY ("escape_venue_id") REFERENCES "escape_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_escape_venue_id_fkey" FOREIGN KEY ("escape_venue_id") REFERENCES "escape_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_escape_room_id_fkey" FOREIGN KEY ("escape_room_id") REFERENCES "escape_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puzzle_maintenance" ADD CONSTRAINT "puzzle_maintenance_escape_venue_id_fkey" FOREIGN KEY ("escape_venue_id") REFERENCES "escape_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puzzle_maintenance" ADD CONSTRAINT "puzzle_maintenance_escape_room_id_fkey" FOREIGN KEY ("escape_room_id") REFERENCES "escape_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_checklists" ADD CONSTRAINT "reset_checklists_escape_venue_id_fkey" FOREIGN KEY ("escape_venue_id") REFERENCES "escape_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_tiers" ADD CONSTRAINT "rate_tiers_escape_venue_id_fkey" FOREIGN KEY ("escape_venue_id") REFERENCES "escape_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prop_orders" ADD CONSTRAINT "prop_orders_escape_venue_id_fkey" FOREIGN KEY ("escape_venue_id") REFERENCES "escape_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
