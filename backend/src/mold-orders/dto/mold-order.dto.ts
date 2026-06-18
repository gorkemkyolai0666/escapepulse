import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MoldOrderStatus } from '@prisma/client';

export class CreateMoldOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  moldType: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(MoldOrderStatus)
  status?: MoldOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMoldOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  moldType?: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(MoldOrderStatus)
  status?: MoldOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
