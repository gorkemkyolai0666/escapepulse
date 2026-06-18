import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { WorkshopCategory, WorkshopRateStatus } from '@prisma/client';

export class CreateWorkshopRateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(WorkshopCategory)
  rateCategory?: WorkshopCategory;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(WorkshopRateStatus)
  status?: WorkshopRateStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWorkshopRateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(WorkshopCategory)
  rateCategory?: WorkshopCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(WorkshopRateStatus)
  status?: WorkshopRateStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
