import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CuringCategory, CuringStatus } from '@prisma/client';

export class CreateCuringChecklistDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CuringCategory)
  category?: CuringCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(CuringStatus)
  status?: CuringStatus;
}

export class UpdateCuringChecklistDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CuringCategory)
  category?: CuringCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(CuringStatus)
  status?: CuringStatus;
}
