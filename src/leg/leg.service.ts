import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LegService {
  constructor(private prisma: PrismaService) {}

  async getPoints(id: string) {
    console.log('get points service called');

    const points = await this.prisma.leg
      .findUnique({ where: { id } })
      .players({ select: { points: true } });

    return points.map((ele) => ele.points);
  }

  async getMatch(matchId: string, id: string) {
    return await this.prisma.leg.findUnique({ where: { id } }).match();
  }
}