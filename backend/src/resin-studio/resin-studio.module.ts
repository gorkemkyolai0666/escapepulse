import { Module } from '@nestjs/common';
import { ResinStudioController } from './resin-studio.controller';
import { ResinStudioService } from './resin-studio.service';

@Module({
  controllers: [ResinStudioController],
  providers: [ResinStudioService],
})
export class ResinStudioModule {}
