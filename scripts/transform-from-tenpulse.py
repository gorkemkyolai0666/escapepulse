#!/usr/bin/env python3
"""Transform tenpulse codebase to glazepulse domain."""
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Directory renames (backend)
BACKEND_RENAMES = {
    "tennis-club": "pottery-studio",
    "courts": "kilns",
    "lesson-sessions": "firing-batches",
    "ball-machine-maintenance": "kiln-maintenance",
    "court-maintenance": "glaze-checklists",
    "stringing-orders": "clay-orders",
}

# Frontend page renames
FRONTEND_PAGE_RENAMES = {
    "courts": "kilns",
    "lesson-sessions": "firing-batches",
    "ball-machine-maintenance": "kiln-maintenance",
    "court-maintenance": "glaze-checklists",
    "stringing-orders": "clay-orders",
}

# File renames inside backend modules
FILE_RENAMES = {
    "tennis-club.controller.ts": "pottery-studio.controller.ts",
    "tennis-club.service.ts": "pottery-studio.service.ts",
    "tennis-club.module.ts": "pottery-studio.module.ts",
    "update-tennis-club.dto.ts": "update-pottery-studio.dto.ts",
    "courts.controller.ts": "kilns.controller.ts",
    "courts.service.ts": "kilns.service.ts",
    "courts.module.ts": "kilns.module.ts",
    "court.dto.ts": "escape-room.dto.ts",
    "lesson-sessions.controller.ts": "firing-batches.controller.ts",
    "lesson-sessions.service.ts": "firing-batches.service.ts",
    "lesson-sessions.module.ts": "firing-batches.module.ts",
    "lesson-session.dto.ts": "game-session.dto.ts",
    "ball-machine-maintenance.controller.ts": "kiln-maintenance.controller.ts",
    "ball-machine-maintenance.service.ts": "kiln-maintenance.service.ts",
    "ball-machine-maintenance.module.ts": "kiln-maintenance.module.ts",
    "ball-machine-maintenance.dto.ts": "kiln-maintenance.dto.ts",
    "court-maintenance.controller.ts": "glaze-checklists.controller.ts",
    "court-maintenance.service.ts": "glaze-checklists.service.ts",
    "court-maintenance.module.ts": "glaze-checklists.module.ts",
    "court-maintenance.dto.ts": "reset-checklist.dto.ts",
    "stringing-orders.controller.ts": "clay-orders.controller.ts",
    "stringing-orders.service.ts": "clay-orders.service.ts",
    "stringing-orders.module.ts": "clay-orders.module.ts",
    "stringing-order.dto.ts": "prop-order.dto.ts",
    "top-tab-nav.tsx": "side-rail.tsx",
}

# Text replacements (order matters — longer first)
REPLACEMENTS = [
    ("tenpulse-dev-secret", "glazepulse-dev-secret"),
    ("tenpulse123", "glazepulse123"),
    ("tenpulse", "glazepulse"),
    ("TenPulse", "GlazePulse"),
    ("tennisClubName", "potteryStudioName"),
    ("tennisClubId", "potteryStudioId"),
    ("tennisClub", "potteryStudio"),
    ("TennisClub", "PotteryStudio"),
    ("tennis_clubs", "pottery_studios"),
    ("tennis_club", "pottery_studio"),
    ("totalCourts", "totalKilns"),
    ("total_courts", "total_kilns"),
    ("ballMachineRentalRevenue", "coneAdjustment"),
    ("ball_machine_rental_revenue", "cone_adjustment"),
    ("dailyBallMachineRentalRevenue", "dailyConeAdjustments"),
    ("ballMachineSpec", "kilnModel"),
    ("ball_machine_spec", "kiln_model"),
    ("BallMachineMaintenance", "KilnMaintenance"),
    ("ballMachineMaintenance", "kilnMaintenance"),
    ("ball_machine_maintenance", "kiln_maintenance"),
    ("ball-machine-maintenance", "kiln-maintenance"),
    ("openBallMachineMaintenance", "openKilnMaintenance"),
    ("urgentBallMachineMaintenance", "urgentKilnMaintenance"),
    ("recentBallMachineMaintenance", "recentKilnMaintenance"),
    ("CourtMaintenance", "GlazeChecklist"),
    ("courtMaintenance", "glazeChecklist"),
    ("court_maintenance", "glaze_checklists"),
    ("court-maintenance", "glaze-checklists"),
    ("pendingCourtMaintenance", "pendingGlazeChecklists"),
    ("StringingOrder", "ClayOrder"),
    ("stringingOrder", "clayOrder"),
    ("stringing_orders", "clay_orders"),
    ("stringing-orders", "clay-orders"),
    ("pendingStringingOrders", "pendingClayOrders"),
    ("completedStringingOrders", "completedClayOrders"),
    ("stringType", "clayBody"),
    ("string_type", "clay_body"),
    ("racketModel", "supplierName"),
    ("racket_model", "supplier_name"),
    ("racketBrand", "propName"),
    ("LessonSession", "FiringBatch"),
    ("lessonSession", "firingBatch"),
    ("lesson_sessions", "firing_batches"),
    ("lesson-sessions", "firing-batches"),
    ("lessonType", "firingType"),
    ("lesson_type", "firing_type"),
    ("totalLessons", "totalBatches"),
    ("recentLessons", "recentBatches"),
    ("CourtSurface", "KilnType"),
    ("CourtStatus", "KilnStatus"),
    ("LessonType", "FiringType"),
    ("BallMachinePriority", "MaintenancePriority"),
    ("BallMachineStatus", "MaintenanceStatus"),
    ("CourtMaintenanceCategory", "GlazeCategory"),
    ("CourtMaintenanceStatus", "GlazeStatus"),
    ("StringingStatus", "ClayOrderStatus"),
    ("CourtsService", "KilnsService"),
    ("CourtsController", "KilnsController"),
    ("CourtsModule", "KilnsModule"),
    ("CreateCourtDto", "CreateKilnDto"),
    ("UpdateCourtDto", "UpdateKilnDto"),
    ("TennisClubService", "PotteryStudioService"),
    ("TennisClubController", "PotteryStudioController"),
    ("TennisClubModule", "PotteryStudioModule"),
    ("UpdateTennisClubDto", "UpdatePotteryStudioDto"),
    ("LessonSessionsService", "FiringBatchsService"),
    ("LessonSessionsController", "FiringBatchsController"),
    ("LessonSessionsModule", "FiringBatchsModule"),
    ("CreateLessonSessionDto", "CreateFiringBatchDto"),
    ("UpdateLessonSessionDto", "UpdateFiringBatchDto"),
    ("BallMachineMaintenanceService", "KilnMaintenanceService"),
    ("BallMachineMaintenanceController", "KilnMaintenanceController"),
    ("BallMachineMaintenanceModule", "KilnMaintenanceModule"),
    ("CourtMaintenanceService", "GlazeChecklistsService"),
    ("CourtMaintenanceController", "GlazeChecklistsController"),
    ("CourtMaintenanceModule", "GlazeChecklistsModule"),
    ("StringingOrdersService", "ClayOrdersService"),
    ("StringingOrdersController", "ClayOrdersController"),
    ("StringingOrdersModule", "ClayOrdersModule"),
    ("courtUtilizationRate", "kilnUtilizationRate"),
    ("courtWings", "studioZones"),
    ("courtCount", "kilnCount"),
    ("totalCourts", "totalKilns"),
    ("availableCourts", "availableKilns"),
    ("inUseCourts", "firingKilns"),
    ("courtId", "kilnId"),
    ("court_id", "kiln_id"),
    ("@Controller('courts')", "@Controller('kilns')"),
    ("@Controller('lesson-sessions')", "@Controller('firing-batches')"),
    ("@Controller('ball-machine-maintenance')", "@Controller('kiln-maintenance')"),
    ("@Controller('court-maintenance')", "@Controller('glaze-checklists')"),
    ("@Controller('stringing-orders')", "@Controller('clay-orders')"),
    ("@Controller('tennis-club')", "@Controller('pottery-studio')"),
    ("'/courts", "'/kilns"),
    ("'/lesson-sessions", "'/firing-batches"),
    ("'/ball-machine-maintenance", "'/kiln-maintenance"),
    ("'/court-maintenance", "'/glaze-checklists"),
    ("'/stringing-orders", "'/clay-orders"),
    ("'/tennis-club", "'/pottery-studio"),
    ("api.courts", "api.kilns"),
    ("api.lessonSessions", "api.firingBatchs"),
    ("api.ballMachineMaintenance", "api.kilnMaintenance"),
    ("api.courtMaintenance", "api.glazeChecklists"),
    ("api.stringingOrders", "api.clayOrders"),
    ("firing", "firing"),
    ("surfaceType", "kilnType"),
    ("surface", "kilnType"),
    ("4015", "4018"),
    ("3015", "3018"),
    ("5455", "5458"),
    ("TopTabNav", "SideRail"),
    ("top-tab-nav", "side-rail"),
    ("clay-nav-border", "mystery-nav-border"),
    ("Sun Courts Tennis Club", "Claywheel Pottery Studio"),
    ("demo@suncourtstennis.com", "demo@claywheelstudio.com"),
    ("suncourtstennis", "claywheelstudio"),
]

SKIP_DIRS = {".git", "node_modules", "dist", ".next", "coverage"}


def should_process(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return False
    return path.suffix in {
        ".ts", ".tsx", ".js", ".json", ".md", ".yml", ".yaml", ".sh",
        ".css", ".prisma", ".example", ".toml", ".txt",
    } or path.name in {".gitignore", "Dockerfile", "README.md"}


def replace_in_file(path: Path) -> None:
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
    print("Transform complete.")


if __name__ == "__main__":
    main()
