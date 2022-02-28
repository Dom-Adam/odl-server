import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  async getDarts(id: string) {
    return await this.prisma.visit.findUnique({ where: { id } }).darts();
  }
}
