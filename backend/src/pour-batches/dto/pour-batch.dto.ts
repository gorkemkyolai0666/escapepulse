import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { PourType, BatchStatus } from '@prisma/client';

export class CreatePourBatchDto {
  @IsUUID()
  workstationId: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(PourType)
  pouringType?: PourType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pieceCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hardenerRatio?: number;

  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePourBatchDto {
  @IsOptional()
  @IsUUID()
  workstationId?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(PourType)
  pouringType?: PourType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pieceCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hardenerRatio?: number;

  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
