import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VisitResolver } from './visit.resolver';
import { VisitService } from './visit.service';

@Module({ providers: [VisitResolver, VisitService, PrismaService] })
export class VisitModule {}
