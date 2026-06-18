#!/usr/bin/env python3
"""Transform escapepulse codebase to glazepulse pottering shop domain."""
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BACKEND_RENAMES = {
    "escape-venue": "pottery-studio",
    "escape-rooms": "kilns",
    "game-sessions": "firing-batches",
    "puzzle-maintenance": "kiln-maintenance",
    "reset-checklists": "glaze-checklists",
    "prop-orders": "clay-orders",
    "rate-tiers": "firing-rates",
}

FRONTEND_PAGE_RENAMES = {
    "escape-rooms": "kilns",
    "game-sessions": "firing-batches",
    "puzzle-maintenance": "kiln-maintenance",
    "reset-checklists": "glaze-checklists",
    "prop-orders": "clay-orders",
    "rate-tiers": "firing-rates",
}

FILE_RENAMES = {
    "escape-venue.controller.ts": "pottery-studio.controller.ts",
    "escape-venue.service.ts": "pottery-studio.service.ts",
    "escape-venue.module.ts": "pottery-studio.module.ts",
    "update-escape-venue.dto.ts": "update-pottery-studio.dto.ts",
    "escape-rooms.controller.ts": "kilns.controller.ts",
    "escape-rooms.service.ts": "kilns.service.ts",
    "escape-rooms.module.ts": "kilns.module.ts",
    "escape-room.dto.ts": "workstation.dto.ts",
    "game-sessions.controller.ts": "firing-batches.controller.ts",
    "game-sessions.service.ts": "firing-batches.service.ts",
    "game-sessions.module.ts": "firing-batches.module.ts",
    "game-session.dto.ts": "alteration-job.dto.ts",
    "puzzle-maintenance.controller.ts": "kiln-maintenance.controller.ts",
    "puzzle-maintenance.service.ts": "kiln-maintenance.service.ts",
    "puzzle-maintenance.module.ts": "kiln-maintenance.module.ts",
    "puzzle-maintenance.dto.ts": "kiln-maintenance.dto.ts",
    "reset-checklists.controller.ts": "glaze-checklists.controller.ts",
    "reset-checklists.service.ts": "glaze-checklists.service.ts",
    "reset-checklists.module.ts": "glaze-checklists.module.ts",
    "reset-checklist.dto.ts": "quality-checklist.dto.ts",
    "prop-orders.controller.ts": "clay-orders.controller.ts",
    "prop-orders.service.ts": "clay-orders.service.ts",
    "prop-orders.module.ts": "clay-orders.module.ts",
    "prop-order.dto.ts": "fabric-order.dto.ts",
    "rate-tiers.controller.ts": "firing-rates.controller.ts",
    "rate-tiers.service.ts": "firing-rates.service.ts",
    "rate-tiers.module.ts": "firing-rates.module.ts",
    "sidebar-nav.tsx": "side-rail.tsx",
}

REPLACEMENTS = [
    ("escapepulse-dev-secret", "glazepulse-dev-secret"),
    ("escapepulse123", "glazepulse123"),
    ("escapepulse", "glazepulse"),
    ("EscapePulse", "GlazePulse"),
    ("escapeVenueName", "potteryStudioName"),
    ("escapeVenueId", "potteryStudioId"),
    ("escapeVenue", "potteryStudio"),
    ("EscapeVenue", "PotteryStudio"),
    ("escape_venues", "pottery_studios"),
    ("escape_venue", "pottery_studio"),
    ("totalRooms", "totalKilns"),
    ("total_rooms", "total_kilns"),
    ("addOnRevenue", "coneAdjustment"),
    ("add_on_revenue", "cone_adjustment"),
    ("dailyAddOnRevenue", "dailyConeAdjustments"),
    ("puzzleMechanism", "kilnModel"),
    ("puzzle_mechanism", "kiln_model"),
    ("PuzzleMaintenance", "KilnMaintenance"),
    ("puzzleMaintenance", "kilnMaintenance"),
    ("puzzle_maintenance", "kiln_maintenance"),
    ("puzzle-maintenance", "kiln-maintenance"),
    ("openPuzzleMaintenance", "openKilnMaintenance"),
    ("urgentPuzzleMaintenance", "urgentKilnMaintenance"),
    ("recentPuzzleMaintenance", "recentKilnMaintenance"),
    ("ResetChecklist", "GlazeChecklist"),
    ("resetChecklist", "glazeChecklist"),
    ("reset_checklists", "glaze_checklists"),
    ("reset-checklists", "glaze-checklists"),
    ("pendingResetChecklists", "pendingGlazeChecklists"),
    ("PropOrder", "ClayOrder"),
    ("propOrder", "clayOrder"),
    ("prop_orders", "clay_orders"),
    ("prop-orders", "clay-orders"),
    ("pendingPropOrders", "pendingClayOrders"),
    ("completedPropOrders", "completedClayOrders"),
    ("propCategory", "clayBody"),
    ("prop_category", "clay_body"),
    ("GameSession", "FiringBatch"),
    ("gameSession", "firingBatch"),
    ("game_sessions", "firing_batches"),
    ("game-sessions", "firing-batches"),
    ("gameType", "firingType"),
    ("game_type", "firing_type"),
    ("totalGames", "totalBatches"),
    ("recentGames", "recentBatches"),
    ("sessionAt", "scheduledAt"),
    ("session_at", "scheduled_at"),
    ("RoomTheme", "KilnType"),
    ("RoomStatus", "KilnStatus"),
    ("GameType", "FiringType"),
    ("SessionStatus", "BatchStatus"),
    ("PuzzlePriority", "MaintenancePriority"),
    ("PuzzleStatus", "MaintenanceStatus"),
    ("ResetCategory", "GlazeCategory"),
    ("ResetStatus", "GlazeStatus"),
    ("PropOrderStatus", "ClayOrderStatus"),
    ("RateTier", "FiringRate"),
    ("rateTier", "firingRate"),
    ("rate_tiers", "firing_rates"),
    ("rate-tiers", "firing-rates"),
    ("RateCategory", "FiringCategory"),
    ("RateStatus", "FiringRateStatus"),
    ("EscapeRoomsService", "KilnsService"),
    ("EscapeRoomsController", "KilnsController"),
    ("EscapeRoomsModule", "KilnsModule"),
    ("CreateEscapeRoomDto", "CreateKilnDto"),
    ("UpdateEscapeRoomDto", "UpdateKilnDto"),
    ("EscapeVenueService", "PotteryStudioService"),
    ("EscapeVenueController", "PotteryStudioController"),
    ("EscapeVenueModule", "PotteryStudioModule"),
    ("UpdateEscapeVenueDto", "UpdatePotteryStudioDto"),
    ("GameSessionsService", "FiringBatchsService"),
    ("GameSessionsController", "FiringBatchsController"),
    ("GameSessionsModule", "FiringBatchsModule"),
    ("CreateGameSessionDto", "CreateFiringBatchDto"),
    ("UpdateGameSessionDto", "UpdateFiringBatchDto"),
    ("PuzzleMaintenanceService", "KilnMaintenanceService"),
    ("PuzzleMaintenanceController", "KilnMaintenanceController"),
    ("PuzzleMaintenanceModule", "KilnMaintenanceModule"),
    ("ResetChecklistsService", "GlazeChecklistsService"),
    ("ResetChecklistsController", "GlazeChecklistsController"),
    ("ResetChecklistsModule", "GlazeChecklistsModule"),
    ("PropOrdersService", "ClayOrdersService"),
    ("PropOrdersController", "ClayOrdersController"),
    ("PropOrdersModule", "ClayOrdersModule"),
    ("roomUtilizationRate", "kilnUtilizationRate"),
    ("roomWings", "studioZones"),
    ("roomCount", "kilnCount"),
    ("availableRooms", "availableKilns"),
    ("inGameRooms", "firingKilns"),
    ("escapeRoomId", "kilnId"),
    ("escape_room_id", "kiln_id"),
    ("EscapeRoom", "Kiln"),
    ("escapeRooms", "kilns"),
    ("escape_rooms", "kilns"),
    ("escape-rooms", "kilns"),
    ("escape-venue", "pottery-studio"),
    ("@Controller('escape-rooms')", "@Controller('kilns')"),
    ("@Controller('game-sessions')", "@Controller('firing-batches')"),
    ("@Controller('puzzle-maintenance')", "@Controller('kiln-maintenance')"),
    ("@Controller('reset-checklists')", "@Controller('glaze-checklists')"),
    ("@Controller('prop-orders')", "@Controller('clay-orders')"),
    ("@Controller('rate-tiers')", "@Controller('firing-rates')"),
    ("@Controller('escape-venue')", "@Controller('pottery-studio')"),
    ("'/escape-rooms", "'/kilns"),
    ("'/game-sessions", "'/firing-batches"),
    ("'/puzzle-maintenance", "'/kiln-maintenance"),
    ("'/reset-checklists", "'/glaze-checklists"),
    ("'/prop-orders", "'/clay-orders"),
    ("'/rate-tiers", "'/firing-rates"),
    ("'/escape-venue", "'/pottery-studio"),
    ("api.escapeRooms", "api.kilns"),
    ("api.gameSessions", "api.firingBatchs"),
    ("api.puzzleMaintenance", "api.kilnMaintenance"),
    ("api.resetChecklists", "api.glazeChecklists"),
    ("api.propOrders", "api.clayOrders"),
    ("api.rateTiers", "api.firingRates"),
    ("api.escapeVenue", "api.potteryStudio"),
    ("in_game", "firing"),
    ("theme", "kilnType"),
    ("4016", "4018"),
    ("3016", "3018"),
    ("5456", "5458"),
    ("SidebarNav", "SideRail"),
    ("sidebar-nav", "side-rail"),
    ("mystery-card", "kiln-card"),
    ("mystery-btn", "kiln-btn"),
    ("room-pill", "kiln-pill"),
    ("Mystery Manor Escapes", "Claywheel Pottery Studio"),
    ("demo@mysterymanorescapes.com", "demo@claywheelstudio.com"),
    ("mysterymanorescapes", "claywheelstudio"),
    ("game_master", "potter"),
    ("Cinzel", "Fraunces"),
    ("IBM Plex Sans", "Source Sans 3"),
    ("font-cinzel", "font-fraunces"),
    ("font-ibm-plex", "font-source"),
    ("--font-cinzel", "--font-fraunces"),
    ("--font-ibm-plex", "--font-source"),
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
    if "transform-from-escapepulse.py" in str(path):
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
