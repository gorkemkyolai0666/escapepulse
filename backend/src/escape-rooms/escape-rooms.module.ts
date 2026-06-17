import { Module } from '@nestjs/common';
import { EscapeRoomsController } from './escape-rooms.controller';
import { EscapeRoomsService } from './escape-rooms.service';

@Module({
  controllers: [EscapeRoomsController],
  providers: [EscapeRoomsService],
})
export class EscapeRoomsModule {}
