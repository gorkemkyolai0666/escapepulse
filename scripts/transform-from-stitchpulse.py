#!/usr/bin/env python3
"""Transform stitchpulse codebase to glazepulse pottery studio domain."""
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BACKEND_RENAMES = {
    "tailoring-shop": "pottery-studio",
    "workstations": "kilns",
    "alteration-jobs": "firing-batches",
    "equipment-maintenance": "kiln-maintenance",
    "quality-checklists": "glaze-checklists",
    "fabric-orders": "clay-orders",
    "service-rates": "firing-rates",
}

FRONTEND_PAGE_RENAMES = {
    "workstations": "kilns",
    "alteration-jobs": "firing-batches",
    "equipment-maintenance": "kiln-maintenance",
    "quality-checklists": "glaze-checklists",
    "fabric-orders": "clay-orders",
    "service-rates": "firing-rates",
}

FILE_RENAMES = {
    "tailoring-shop.controller.ts": "pottery-studio.controller.ts",
    "tailoring-shop.service.ts": "pottery-studio.service.ts",
    "tailoring-shop.module.ts": "pottery-studio.module.ts",
    "update-tailoring-shop.dto.ts": "update-pottery-studio.dto.ts",
    "workstations.controller.ts": "kilns.controller.ts",
    "workstations.service.ts": "kilns.service.ts",
    "workstations.module.ts": "kilns.module.ts",
    "workstation.dto.ts": "kiln.dto.ts",
    "alteration-jobs.controller.ts": "firing-batches.controller.ts",
    "alteration-jobs.service.ts": "firing-batches.service.ts",
    "alteration-jobs.module.ts": "firing-batches.module.ts",
    "alteration-job.dto.ts": "firing-batch.dto.ts",
    "equipment-maintenance.controller.ts": "kiln-maintenance.controller.ts",
    "equipment-maintenance.service.ts": "kiln-maintenance.service.ts",
    "equipment-maintenance.module.ts": "kiln-maintenance.module.ts",
    "equipment-maintenance.dto.ts": "kiln-maintenance.dto.ts",
    "quality-checklists.controller.ts": "glaze-checklists.controller.ts",
    "quality-checklists.service.ts": "glaze-checklists.service.ts",
    "quality-checklists.module.ts": "glaze-checklists.module.ts",
    "quality-checklist.dto.ts": "glaze-checklist.dto.ts",
    "fabric-orders.controller.ts": "clay-orders.controller.ts",
    "fabric-orders.service.ts": "clay-orders.service.ts",
    "fabric-orders.module.ts": "clay-orders.module.ts",
    "fabric-order.dto.ts": "clay-order.dto.ts",
    "service-rates.controller.ts": "firing-rates.controller.ts",
    "service-rates.service.ts": "firing-rates.service.ts",
    "service-rates.module.ts": "firing-rates.module.ts",
    "rate-tier.dto.ts": "firing-rate.dto.ts",
    "top-nav.tsx": "side-rail.tsx",
}

REPLACEMENTS = [
    ("stitchpulse-dev-secret", "glazepulse-dev-secret"),
    ("stitchpulse123", "glazepulse123"),
    ("stitchpulse", "glazepulse"),
    ("StitchPulse", "GlazePulse"),
    ("tailoringShopName", "potteryStudioName"),
    ("tailoringShopId", "potteryStudioId"),
    ("tailoringShop", "potteryStudio"),
    ("TailoringShop", "PotteryStudio"),
    ("tailoring_shops", "pottery_studios"),
    ("tailoring_shop", "pottery_studio"),
    ("totalWorkstations", "totalKilns"),
    ("total_workstations", "total_kilns"),
    ("rushFee", "coneAdjustment"),
    ("rush_fee", "cone_adjustment"),
    ("dailyRushFees", "dailyConeAdjustments"),
    ("machineModel", "kilnModel"),
    ("machine_model", "kiln_model"),
    ("EquipmentMaintenance", "KilnMaintenance"),
    ("equipmentMaintenance", "kilnMaintenance"),
    ("equipment_maintenance", "kiln_maintenance"),
    ("equipment-maintenance", "kiln-maintenance"),
    ("openEquipmentMaintenance", "openKilnMaintenance"),
    ("urgentEquipmentMaintenance", "urgentKilnMaintenance"),
    ("recentEquipmentMaintenance", "recentKilnMaintenance"),
    ("QualityChecklist", "GlazeChecklist"),
    ("qualityChecklist", "glazeChecklist"),
    ("quality_checklists", "glaze_checklists"),
    ("quality-checklists", "glaze-checklists"),
    ("pendingQualityChecklists", "pendingGlazeChecklists"),
    ("FabricOrder", "ClayOrder"),
    ("fabricOrder", "clayOrder"),
    ("fabric_orders", "clay_orders"),
    ("fabric-orders", "clay-orders"),
    ("pendingFabricOrders", "pendingClayOrders"),
    ("completedFabricOrders", "completedClayOrders"),
    ("fabricType", "clayBody"),
    ("fabric_type", "clay_body"),
    ("AlterationJob", "FiringBatch"),
    ("alterationJob", "firingBatch"),
    ("alteration_jobs", "firing_batches"),
    ("alteration-jobs", "firing-batches"),
    ("jobType", "firingType"),
    ("job_type", "firing_type"),
    ("totalJobs", "totalBatches"),
    ("recentJobs", "recentBatches"),
    ("dueAt", "scheduledAt"),
    ("due_at", "scheduled_at"),
    ("WorkstationSpecialty", "KilnType"),
    ("WorkstationStatus", "KilnStatus"),
    ("JobType", "FiringType"),
    ("JobStatus", "BatchStatus"),
    ("EquipmentPriority", "MaintenancePriority"),
    ("EquipmentStatus", "MaintenanceStatus"),
    ("ChecklistCategory", "GlazeCategory"),
    ("ChecklistStatus", "GlazeStatus"),
    ("FabricOrderStatus", "ClayOrderStatus"),
    ("ServiceRate", "FiringRate"),
    ("serviceRate", "firingRate"),
    ("service_rates", "firing_rates"),
    ("service-rates", "firing-rates"),
    ("ServiceCategory", "FiringCategory"),
    ("ServiceRateStatus", "FiringRateStatus"),
    ("WorkstationsService", "KilnsService"),
    ("WorkstationsController", "KilnsController"),
    ("WorkstationsModule", "KilnsModule"),
    ("CreateWorkstationDto", "CreateKilnDto"),
    ("UpdateWorkstationDto", "UpdateKilnDto"),
    ("TailoringShopService", "PotteryStudioService"),
    ("TailoringShopController", "PotteryStudioController"),
    ("TailoringShopModule", "PotteryStudioModule"),
    ("UpdateTailoringShopDto", "UpdatePotteryStudioDto"),
    ("AlterationJobsService", "FiringBatchesService"),
    ("AlterationJobsController", "FiringBatchesController"),
    ("AlterationJobsModule", "FiringBatchesModule"),
    ("CreateAlterationJobDto", "CreateFiringBatchDto"),
    ("UpdateAlterationJobDto", "UpdateFiringBatchDto"),
    ("EquipmentMaintenanceService", "KilnMaintenanceService"),
    ("EquipmentMaintenanceController", "KilnMaintenanceController"),
    ("EquipmentMaintenanceModule", "KilnMaintenanceModule"),
    ("QualityChecklistsService", "GlazeChecklistsService"),
    ("QualityChecklistsController", "GlazeChecklistsController"),
    ("QualityChecklistsModule", "GlazeChecklistsModule"),
    ("FabricOrdersService", "ClayOrdersService"),
    ("FabricOrdersController", "ClayOrdersController"),
    ("FabricOrdersModule", "ClayOrdersModule"),
    ("workstationUtilizationRate", "kilnUtilizationRate"),
    ("shopZones", "studioZones"),
    ("workstationCount", "kilnCount"),
    ("availableWorkstations", "availableKilns"),
    ("inUseWorkstations", "firingKilns"),
    ("workstationId", "kilnId"),
    ("workstation_id", "kiln_id"),
    ("Workstation", "Kiln"),
    ("workstations", "kilns"),
    ("tailoring-shop", "pottery-studio"),
    ("@Controller('workstations')", "@Controller('kilns')"),
    ("@Controller('alteration-jobs')", "@Controller('firing-batches')"),
    ("@Controller('equipment-maintenance')", "@Controller('kiln-maintenance')"),
    ("@Controller('quality-checklists')", "@Controller('glaze-checklists')"),
    ("@Controller('fabric-orders')", "@Controller('clay-orders')"),
    ("@Controller('service-rates')", "@Controller('firing-rates')"),
    ("@Controller('tailoring-shop')", "@Controller('pottery-studio')"),
    ("'/workstations", "'/kilns"),
    ("'/alteration-jobs", "'/firing-batches"),
    ("'/equipment-maintenance", "'/kiln-maintenance"),
    ("'/quality-checklists", "'/glaze-checklists"),
    ("'/fabric-orders", "'/clay-orders"),
    ("'/service-rates", "'/firing-rates"),
    ("'/tailoring-shop", "'/pottery-studio"),
    ("api.workstations", "api.kilns"),
    ("api.alterationJobs", "api.firingBatches"),
    ("api.equipmentMaintenance", "api.kilnMaintenance"),
    ("api.qualityChecklists", "api.glazeChecklists"),
    ("api.fabricOrders", "api.clayOrders"),
    ("api.serviceRates", "api.firingRates"),
    ("api.tailoringShop", "api.potteryStudio"),
    ("in_use", "firing"),
    ("specialty", "kilnType"),
    ("4017", "4018"),
    ("3017", "3018"),
    ("5457", "5458"),
    ("TopNav", "SideRail"),
    ("top-nav", "side-rail"),
    ("atelier-card", "kiln-card"),
    ("atelier-btn", "kiln-btn"),
    ("station-pill", "kiln-pill"),
    ("Heritage Tailors & Alterations", "Claywheel Pottery Studio"),
    ("demo@heritagetailors.com", "demo@claywheelstudio.com"),
    ("heritagetailors", "claywheelstudio"),
    ("tailor", "potter"),
    ("Playfair Display", "Fraunces"),
    ("DM Sans", "Source Sans 3"),
    ("font-playfair", "font-fraunces"),
    ("font-dm-sans", "font-source"),
    ("--font-playfair", "--font-fraunces"),
    ("--font-dm-sans", "--font-source"),
]

SKIP_DIRS = {".git", "node_modules", "dist", ".next", "coverage"}


def should_process(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return False
    return path.suffix in {
        ".ts", ".tsx", ".js", ".json", ".md", ".yml", ".yaml", ".sh",
        ".css", ".prisma", ".example", ".toml", ".txt", ".py",
    } or path.name in {".gitignore", "Dockerfile", "README.md"}


def replace_in_file(path: Path) -> None:
    if "transform-from-stitchpulse.py" in str(path):
        return
    try:
        content = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, IsADirectoryError):
        return
    original = content
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)
    if content != original:
        path.write_text(content, encoding="utf-8")


def rename_backend_dirs() -> None:
    backend_src = ROOT / "backend" / "src"
    for old, new in BACKEND_RENAMES.items():
        old_path = backend_src / old
        new_path = backend_src / new
        if old_path.exists():
            if new_path.exists():
                shutil.rmtree(new_path)
            old_path.rename(new_path)


def rename_frontend_pages() -> None:
    app_dir = ROOT / "frontend" / "src" / "app"
    for old, new in FRONTEND_PAGE_RENAMES.items():
        old_path = app_dir / old
        new_path = app_dir / new
        if old_path.exists():
            if new_path.exists():
                shutil.rmtree(new_path)
            old_path.rename(new_path)


def rename_files() -> None:
    for dirpath, _, filenames in os.walk(ROOT):
        if any(s in dirpath for s in SKIP_DIRS):
            continue
        for filename in filenames:
            if filename in FILE_RENAMES:
                old = Path(dirpath) / filename
                new = Path(dirpath) / FILE_RENAMES[filename]
                if new.exists():
                    new.unlink()
                old.rename(new)


def process_all_files() -> None:
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for filename in filenames:
            path = Path(dirpath) / filename
            if should_process(path):
                replace_in_file(path)


def main() -> None:
    rename_backend_dirs()
    rename_frontend_pages()
    rename_files()
    process_all_files()
    print("GlazePulse transform complete.")


if __name__ == "__main__":
    main()
