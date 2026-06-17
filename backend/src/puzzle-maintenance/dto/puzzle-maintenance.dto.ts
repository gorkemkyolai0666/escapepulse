import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PuzzlePriority, PuzzleStatus } from '@prisma/client';

export class CreatePuzzleMaintenanceDto {
  @IsUUID()
  escapeRoomId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsEnum(PuzzlePriority)
  priority?: PuzzlePriority;

  @IsOptional()
  @IsEnum(PuzzleStatus)
  status?: PuzzleStatus;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePuzzleMaintenanceDto {
  @IsOptional()
  @IsUUID()
  escapeRoomId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsEnum(PuzzlePriority)
  priority?: PuzzlePriority;

  @IsOptional()
  @IsEnum(PuzzleStatus)
  status?: PuzzleStatus;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
