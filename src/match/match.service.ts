import { Inject, Injectable } from '@nestjs/common';
import { Leg } from '@prisma/client';
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
    pointsScored: number,
    matchId: string,
    player: string,
    legId: string,
  ) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        players: true,
        legs: {
          where: { isFinished: false },
        },
      },
    });

    let id = legId;

    if (match.legs.length == 0) {
      const leg = await this.prisma.leg.create({
        data: {
          matchId: match.id,
          players: {
            create: [
              { playerId: match.players[0].playerId },
              { playerId: match.players[1].playerId },
            ],
          },
        },
      });
      id = leg.id;
    }

    const pointsLeft = await (
      await this.prisma.legsOnPlayers.findUnique({
        where: { legId_playerId: { legId: id, playerId: player } },
      })
    ).points;

    if (pointsLeft > pointsScored) {
      await this.prisma.legsOnPlayers.update({
        where: { legId_playerId: { legId: id, playerId: player } },
        data: { points: { decrement: pointsScored } },
      });
    } else if (pointsLeft == pointsScored) {
      await this.prisma.leg.update({
        where: { id },
        data: {
          isFinished: true,
          players: {
            update: {
              where: { legId_playerId: { legId: id, playerId: player } },
              data: { points: 0 },
            },
          },
        },
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
