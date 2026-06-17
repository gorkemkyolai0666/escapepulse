import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoomStatus, RoomTheme } from '@prisma/client';

export class CreateEscapeRoomDto {
  @IsString()
  name: string;

  @IsString()
  wing: string;

  @IsOptional()
  @IsEnum(RoomTheme)
  theme?: RoomTheme;

  @IsOptional()
  @IsString()
  puzzleMechanism?: string;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEscapeRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  wing?: string;

  @IsOptional()
  @IsEnum(RoomTheme)
  theme?: RoomTheme;

  @IsOptional()
  @IsString()
  puzzleMechanism?: string;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
