import { Module } from '@nestjs/common';
import { MovementsResolver } from './movements.resolver.js';
import { MovementsService } from './movements.service.js';

@Module({
  providers: [MovementsResolver, MovementsService],
})
export class MovementsModule {}
