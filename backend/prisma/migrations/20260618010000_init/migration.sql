-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'artisan');

-- CreateEnum
CREATE TYPE "WorkstationType" AS ENUM ('standard', 'premium', 'pressure_pot', 'vacuum_chamber', 'studio');

-- CreateEnum
CREATE TYPE "WorkstationStatus" AS ENUM ('available', 'pouring', 'curing', 'maintenance', 'offline');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "PourType" AS ENUM ('countertop', 'river_table', 'jewelry', 'coaster', 'charcuterie', 'custom');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "CuringCategory" AS ENUM ('humidity_check', 'temperature_log', 'mold_prep', 'pigment_mix', 'inventory', 'other');

-- CreateEnum
CREATE TYPE "CuringStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "WorkshopCategory" AS ENUM ('pour_session', 'class_rental', 'custom_commission', 'material_sale', 'custom_work', 'other');

-- CreateEnum
CREATE TYPE "WorkshopRateStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "MoldOrderStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered');

-- CreateTable
CREATE TABLE "resin_studios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_workstations" INTEGER NOT NULL DEFAULT 6,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resin_studios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "resin_studio_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workstations" (
    "id" TEXT NOT NULL,
    "resin_studio_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "workstation_type" "WorkstationType" NOT NULL DEFAULT 'standard',
    "workstation_model" TEXT,
    "status" "WorkstationStatus" NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workstations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pour_batches" (
    "id" TEXT NOT NULL,
    "resin_studio_id" TEXT NOT NULL,
    "workstation_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "pouring_type" "PourType" NOT NULL DEFAULT 'countertop',
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "piece_count" INTEGER NOT NULL DEFAULT 1,
    "hardener_ratio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "BatchStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pour_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_repairs" (
    "id" TEXT NOT NULL,
    "resin_studio_id" TEXT NOT NULL,
    "workstation_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'medium',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_repairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curing_checklists" (
    "id" TEXT NOT NULL,
    "resin_studio_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "CuringCategory" NOT NULL DEFAULT 'other',
    "zone" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "CuringStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curing_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshop_rates" (
    "id" TEXT NOT NULL,
    "resin_studio_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rate_category" "WorkshopCategory" NOT NULL DEFAULT 'pour_session',
    "status" "WorkshopRateStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshop_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mold_orders" (
    "id" TEXT NOT NULL,
    "resin_studio_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "mold_type" TEXT NOT NULL,
    "supplier_name" TEXT,
    "status" "MoldOrderStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mold_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workstations_resin_studio_id_name_key" ON "workstations"("resin_studio_id", "name");

-- CreateIndex
CREATE INDEX "workstations_resin_studio_id_status_idx" ON "workstations"("resin_studio_id", "status");

-- CreateIndex
CREATE INDEX "pour_batches_resin_studio_id_scheduled_at_idx" ON "pour_batches"("resin_studio_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "pour_batches_resin_studio_id_status_idx" ON "pour_batches"("resin_studio_id", "status");

-- CreateIndex
CREATE INDEX "equipment_repairs_resin_studio_id_status_idx" ON "equipment_repairs"("resin_studio_id", "status");

-- CreateIndex
CREATE INDEX "equipment_repairs_resin_studio_id_priority_idx" ON "equipment_repairs"("resin_studio_id", "priority");

-- CreateIndex
CREATE INDEX "curing_checklists_resin_studio_id_scheduled_at_idx" ON "curing_checklists"("resin_studio_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "workshop_rates_resin_studio_id_rate_category_idx" ON "workshop_rates"("resin_studio_id", "rate_category");

-- CreateIndex
CREATE INDEX "mold_orders_resin_studio_id_status_idx" ON "mold_orders"("resin_studio_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_resin_studio_id_fkey" FOREIGN KEY ("resin_studio_id") REFERENCES "resin_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workstations" ADD CONSTRAINT "workstations_resin_studio_id_fkey" FOREIGN KEY ("resin_studio_id") REFERENCES "resin_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pour_batches" ADD CONSTRAINT "pour_batches_resin_studio_id_fkey" FOREIGN KEY ("resin_studio_id") REFERENCES "resin_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pour_batches" ADD CONSTRAINT "pour_batches_workstation_id_fkey" FOREIGN KEY ("workstation_id") REFERENCES "workstations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_repairs" ADD CONSTRAINT "equipment_repairs_resin_studio_id_fkey" FOREIGN KEY ("resin_studio_id") REFERENCES "resin_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_repairs" ADD CONSTRAINT "equipment_repairs_workstation_id_fkey" FOREIGN KEY ("workstation_id") REFERENCES "workstations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curing_checklists" ADD CONSTRAINT "curing_checklists_resin_studio_id_fkey" FOREIGN KEY ("resin_studio_id") REFERENCES "resin_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_rates" ADD CONSTRAINT "workshop_rates_resin_studio_id_fkey" FOREIGN KEY ("resin_studio_id") REFERENCES "resin_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mold_orders" ADD CONSTRAINT "mold_orders_resin_studio_id_fkey" FOREIGN KEY ("resin_studio_id") REFERENCES "resin_studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
