import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LegResolver } from './leg.resolver';
import { LegService } from './leg.service';

@Module({
  providers: [PrismaService, LegResolver, LegService],
})
export class LegModule {}
