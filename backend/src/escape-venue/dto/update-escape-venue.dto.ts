import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateEscapeVenueDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalRooms?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}
