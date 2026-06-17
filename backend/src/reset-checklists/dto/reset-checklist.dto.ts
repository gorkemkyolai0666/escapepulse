import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ResetCategory, ResetStatus } from '@prisma/client';

export class CreateResetChecklistDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ResetCategory)
  category?: ResetCategory;

  @IsOptional()
  @IsString()
  wing?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(ResetStatus)
  status?: ResetStatus;
}

export class UpdateResetChecklistDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ResetCategory)
  category?: ResetCategory;

  @IsOptional()
  @IsString()
  wing?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(ResetStatus)
  status?: ResetStatus;
}
