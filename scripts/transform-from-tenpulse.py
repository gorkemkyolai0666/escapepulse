#!/usr/bin/env python3
"""Transform tenpulse codebase to escapepulse domain."""
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Directory renames (backend)
BACKEND_RENAMES = {
    "tennis-club": "escape-venue",
    "courts": "escape-rooms",
    "lesson-sessions": "game-sessions",
    "ball-machine-maintenance": "puzzle-maintenance",
    "court-maintenance": "reset-checklists",
    "stringing-orders": "prop-orders",
}

# Frontend page renames
FRONTEND_PAGE_RENAMES = {
    "courts": "escape-rooms",
    "lesson-sessions": "game-sessions",
    "ball-machine-maintenance": "puzzle-maintenance",
    "court-maintenance": "reset-checklists",
    "stringing-orders": "prop-orders",
}

# File renames inside backend modules
FILE_RENAMES = {
    "tennis-club.controller.ts": "escape-venue.controller.ts",
    "tennis-club.service.ts": "escape-venue.service.ts",
    "tennis-club.module.ts": "escape-venue.module.ts",
    "update-tennis-club.dto.ts": "update-escape-venue.dto.ts",
    "courts.controller.ts": "escape-rooms.controller.ts",
    "courts.service.ts": "escape-rooms.service.ts",
    "courts.module.ts": "escape-rooms.module.ts",
    "court.dto.ts": "escape-room.dto.ts",
    "lesson-sessions.controller.ts": "game-sessions.controller.ts",
    "lesson-sessions.service.ts": "game-sessions.service.ts",
    "lesson-sessions.module.ts": "game-sessions.module.ts",
    "lesson-session.dto.ts": "game-session.dto.ts",
    "ball-machine-maintenance.controller.ts": "puzzle-maintenance.controller.ts",
    "ball-machine-maintenance.service.ts": "puzzle-maintenance.service.ts",
    "ball-machine-maintenance.module.ts": "puzzle-maintenance.module.ts",
    "ball-machine-maintenance.dto.ts": "puzzle-maintenance.dto.ts",
    "court-maintenance.controller.ts": "reset-checklists.controller.ts",
    "court-maintenance.service.ts": "reset-checklists.service.ts",
    "court-maintenance.module.ts": "reset-checklists.module.ts",
    "court-maintenance.dto.ts": "reset-checklist.dto.ts",
    "stringing-orders.controller.ts": "prop-orders.controller.ts",
    "stringing-orders.service.ts": "prop-orders.service.ts",
    "stringing-orders.module.ts": "prop-orders.module.ts",
    "stringing-order.dto.ts": "prop-order.dto.ts",
    "top-tab-nav.tsx": "sidebar-nav.tsx",
}

# Text replacements (order matters — longer first)
REPLACEMENTS = [
    ("tenpulse-dev-secret", "escapepulse-dev-secret"),
    ("tenpulse123", "escapepulse123"),
    ("tenpulse", "escapepulse"),
    ("TenPulse", "EscapePulse"),
    ("tennisClubName", "escapeVenueName"),
    ("tennisClubId", "escapeVenueId"),
    ("tennisClub", "escapeVenue"),
    ("TennisClub", "EscapeVenue"),
    ("tennis_clubs", "escape_venues"),
    ("tennis_club", "escape_venue"),
    ("totalCourts", "totalRooms"),
    ("total_courts", "total_rooms"),
    ("ballMachineRentalRevenue", "addOnRevenue"),
    ("ball_machine_rental_revenue", "add_on_revenue"),
    ("dailyBallMachineRentalRevenue", "dailyAddOnRevenue"),
    ("ballMachineSpec", "puzzleMechanism"),
    ("ball_machine_spec", "puzzle_mechanism"),
    ("BallMachineMaintenance", "PuzzleMaintenance"),
    ("ballMachineMaintenance", "puzzleMaintenance"),
    ("ball_machine_maintenance", "puzzle_maintenance"),
    ("ball-machine-maintenance", "puzzle-maintenance"),
    ("openBallMachineMaintenance", "openPuzzleMaintenance"),
    ("urgentBallMachineMaintenance", "urgentPuzzleMaintenance"),
    ("recentBallMachineMaintenance", "recentPuzzleMaintenance"),
    ("CourtMaintenance", "ResetChecklist"),
    ("courtMaintenance", "resetChecklist"),
    ("court_maintenance", "reset_checklists"),
    ("court-maintenance", "reset-checklists"),
    ("pendingCourtMaintenance", "pendingResetChecklists"),
    ("StringingOrder", "PropOrder"),
    ("stringingOrder", "propOrder"),
    ("stringing_orders", "prop_orders"),
    ("stringing-orders", "prop-orders"),
    ("pendingStringingOrders", "pendingPropOrders"),
    ("completedStringingOrders", "completedPropOrders"),
    ("stringType", "propCategory"),
    ("string_type", "prop_category"),
    ("racketModel", "supplierName"),
    ("racket_model", "supplier_name"),
    ("racketBrand", "propName"),
    ("LessonSession", "GameSession"),
    ("lessonSession", "gameSession"),
    ("lesson_sessions", "game_sessions"),
    ("lesson-sessions", "game-sessions"),
    ("lessonType", "gameType"),
    ("lesson_type", "game_type"),
    ("totalLessons", "totalGames"),
    ("recentLessons", "recentGames"),
    ("CourtSurface", "RoomTheme"),
    ("CourtStatus", "RoomStatus"),
    ("LessonType", "GameType"),
    ("BallMachinePriority", "PuzzlePriority"),
    ("BallMachineStatus", "PuzzleStatus"),
    ("CourtMaintenanceCategory", "ResetCategory"),
    ("CourtMaintenanceStatus", "ResetStatus"),
    ("StringingStatus", "PropOrderStatus"),
    ("CourtsService", "EscapeRoomsService"),
    ("CourtsController", "EscapeRoomsController"),
    ("CourtsModule", "EscapeRoomsModule"),
    ("CreateCourtDto", "CreateEscapeRoomDto"),
    ("UpdateCourtDto", "UpdateEscapeRoomDto"),
    ("TennisClubService", "EscapeVenueService"),
    ("TennisClubController", "EscapeVenueController"),
    ("TennisClubModule", "EscapeVenueModule"),
    ("UpdateTennisClubDto", "UpdateEscapeVenueDto"),
    ("LessonSessionsService", "GameSessionsService"),
    ("LessonSessionsController", "GameSessionsController"),
    ("LessonSessionsModule", "GameSessionsModule"),
    ("CreateLessonSessionDto", "CreateGameSessionDto"),
    ("UpdateLessonSessionDto", "UpdateGameSessionDto"),
    ("BallMachineMaintenanceService", "PuzzleMaintenanceService"),
    ("BallMachineMaintenanceController", "PuzzleMaintenanceController"),
    ("BallMachineMaintenanceModule", "PuzzleMaintenanceModule"),
    ("CourtMaintenanceService", "ResetChecklistsService"),
    ("CourtMaintenanceController", "ResetChecklistsController"),
    ("CourtMaintenanceModule", "ResetChecklistsModule"),
    ("StringingOrdersService", "PropOrdersService"),
    ("StringingOrdersController", "PropOrdersController"),
    ("StringingOrdersModule", "PropOrdersModule"),
    ("courtUtilizationRate", "roomUtilizationRate"),
    ("courtWings", "roomWings"),
    ("courtCount", "roomCount"),
    ("totalCourts", "totalRooms"),
    ("availableCourts", "availableRooms"),
    ("inUseCourts", "inGameRooms"),
    ("courtId", "escapeRoomId"),
    ("court_id", "escape_room_id"),
    ("@Controller('courts')", "@Controller('escape-rooms')"),
    ("@Controller('lesson-sessions')", "@Controller('game-sessions')"),
    ("@Controller('ball-machine-maintenance')", "@Controller('puzzle-maintenance')"),
    ("@Controller('court-maintenance')", "@Controller('reset-checklists')"),
    ("@Controller('stringing-orders')", "@Controller('prop-orders')"),
    ("@Controller('tennis-club')", "@Controller('escape-venue')"),
    ("'/courts", "'/escape-rooms"),
    ("'/lesson-sessions", "'/game-sessions"),
    ("'/ball-machine-maintenance", "'/puzzle-maintenance"),
    ("'/court-maintenance", "'/reset-checklists"),
    ("'/stringing-orders", "'/prop-orders"),
    ("'/tennis-club", "'/escape-venue"),
    ("api.courts", "api.escapeRooms"),
    ("api.lessonSessions", "api.gameSessions"),
    ("api.ballMachineMaintenance", "api.puzzleMaintenance"),
    ("api.courtMaintenance", "api.resetChecklists"),
    ("api.stringingOrders", "api.propOrders"),
    ("in_use", "in_game"),
    ("surfaceType", "theme"),
    ("surface", "theme"),
    ("4015", "4016"),
    ("3015", "3016"),
    ("5455", "5456"),
    ("TopTabNav", "SidebarNav"),
    ("top-tab-nav", "sidebar-nav"),
    ("clay-nav-border", "mystery-nav-border"),
    ("Sun Courts Tennis Club", "Mystery Manor Escapes"),
    ("demo@suncourtstennis.com", "demo@mysterymanorescapes.com"),
    ("suncourtstennis", "mysterymanorescapes"),
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
