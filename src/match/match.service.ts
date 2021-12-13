import { Inject, Injectable } from '@nestjs/common';
import { visit } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(
    private prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  queue: Array<string> = [];
  loopIsRunning = false;

  async matchPlayers() {
    this.loopIsRunning = true;

    while (this.queue.length > 1) {
      const player1Id = this.queue.shift();
      const player2Id = this.queue.shift();

      try {
        const match = await this.prisma.match.create({
          data: {
            players: {
              create: [
                {
                  index: 1,
                  playerId: player1Id,
                },
                {
                  index: 2,
                  playerId: player2Id,
                },
              ],
            },
            legs: {
              create: {
                players: {
                  create: [{ playerId: player1Id }, { playerId: player2Id }],
                },
              },
            },
          },
        });
        console.log(match);

        this.pubSub.publish(`user${player1Id}`, { getMatchId: match });
        this.pubSub.publish(`user${player2Id}`, { getMatchId: match });
      } catch (e) {
        console.log(e);
      }
    }
    this.loopIsRunning = false;
  }

  async findAll() {
    return await this.prisma.match.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.match.findUnique({ where: { id } });
  }

  searchOpponent(user: string) {
    this.queue.push(user);
    if (!this.loopIsRunning) {
      this.matchPlayers();
    }
    return user;
  }

  async legs(id: string) {
    return await this.prisma.match.findUnique({ where: { id } }).legs();
  }

  async handleVisit(
    field: number,
    segment: number,
    matchId: string,
    player: string,
    legId: string,
  ) {
    const match = this.prisma.match.findUnique({
      where: { id: matchId },
      include: { legs: { where: { isFinished: false } }, players: true },
    });

    let id = legId;
    if (match.legs.length == 0) {
      const leg = await this.prisma.leg.create({
        data: {
          players: {
            create: [
              { playerId: match.players[0] },
              { playerId: match.players[1] },
            ],
          },
          matchId,
        },
      });

      id = leg.id;
    }

    const visit =
      (await this.prisma.visit.findFirst({
        where: { legId: id, playerId: player, isFinished: false },
        include: { darts: { select: { value: true } } },
      })) ||
      (await this.prisma.visit.create({
        data: { playerId: player, legId: id },
        include: { darts: { select: { value: true } } },
      }));

    let visitPoints = field * segment;
    visit.darts.forEach((ele) => (visitPoints += ele.value));
    const { points } = await this.prisma.legsOnPlayers.findUnique({
      where: { legId_playerId: { legId: id, playerId: player } },
      select: { points: true },
    });

    if (points >= visitPoints) {
      await this.prisma.dart.create({
        data: { value: field * segment, field, segment, visitId: visit.id },
      });

      if (points == visitPoints || visit.darts.length >= 2) {
        await this.prisma.visit.update({
          where: { id: visit.id },
          data: { isFinished: true },
        });

        await this.prisma.legsOnPlayers.update({
          where: { legId_playerId: { legId: id, playerId: player } },
          data: { points: { decrement: visitPoints } },
        });

        if (points == visitPoints) {
          await this.prisma.leg.update({
            where: { id },
            data: { isFinished: true },
          });
        }
      }
    } else {
      await this.prisma.visit.update({
        where: { id: visit.id },
        data: { isFinished: true },
      });

      await this.prisma.dart.updateMany({
        where: { visitId: visit.id },
        data: { value: 0 },
      });

      await this.prisma.dart.create({
        data: { value: 0, field, segment, visitId: visit.id },
      });
    }

    return await this.prisma.match.findUnique({ where: { id: matchId } });
  }

  async getPlayers(id: string) {
    const match = await this.prisma.match
      .findUnique({ where: { id } })
      .players({ select: { matchPlayer: true }, orderBy: { index: 'asc' } });

    return match.map((ele) => ele.matchPlayer);
  }

  async getLegs(id: string) {
    return await this.prisma.match.findUnique({ where: { id } }).legs();
  }
}
