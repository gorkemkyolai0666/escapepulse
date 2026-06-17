import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { GameType, SessionStatus } from '@prisma/client';

export class CreateGameSessionDto {
  @IsUUID()
  escapeRoomId: string;

  @IsOptional()
  @IsDateString()
  sessionAt?: string;

  @IsOptional()
  @IsEnum(GameType)
  gameType?: GameType;

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
  participants?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  addOnRevenue?: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateGameSessionDto {
  @IsOptional()
  @IsUUID()
  escapeRoomId?: string;

  @IsOptional()
  @IsDateString()
  sessionAt?: string;

  @IsOptional()
  @IsEnum(GameType)
  gameType?: GameType;

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
  participants?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  addOnRevenue?: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
