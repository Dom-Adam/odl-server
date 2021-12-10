import { Module } from '@nestjs/common';
import { MatchResolver } from './match.resolver';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchService } from './match.service';

@Module({
  imports: [PubSubModule],
  providers: [MatchResolver, PrismaService, MatchService],
})
export class MatchModule {}
