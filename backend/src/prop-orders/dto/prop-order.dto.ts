import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PropOrderStatus } from '@prisma/client';

export class CreatePropOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  propCategory: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(PropOrderStatus)
  status?: PropOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePropOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  propCategory?: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(PropOrderStatus)
  status?: PropOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
