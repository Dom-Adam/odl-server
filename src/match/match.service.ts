import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { UpdateMatchInput } from './dto/update-match.input';
import { Leg } from './entities/leg.entity';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private userService: UserService,
    private connection: Connection,
    @InjectRepository(Leg)
    private legRepository: Repository<Leg>,
  ) {}
  queue: Array<number> = [];

  async matchPlayers() {
    this.loopIsRunning = true;
    while (this.queue.length > 1) {
      await this.create(
        await this.userService.findOne(this.queue.shift()),
        await this.userService.findOne(this.queue.shift()),
      );
    }
    this.loopIsRunning = false;
  }

  add(id: number) {
    this.queue.push(id);
    if (!this.loopIsRunning) {
      this.matchPlayers();
    }
  }

  loopIsRunning = false;

  async create(player1, player2) {
    const match = this.matchRepository.create({
      player1,
      player2,
    });
    return await this.matchRepository.save(match);
  }

  async findAll() {
    return await this.matchRepository.find();
  }

  async findOne(id: number) {
    return await this.matchRepository.findOne(id);
  }

  update(id: number, updateMatchInput: UpdateMatchInput) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }

  searchOpponent(player: number) {
    this.add(player);
  }

  stopSearchingOpponent(player: number) {
    this.queue.filter((ele) => ele != player);
  }

  async handleVisit(points: number, matchId: number, player: number) {
    const match = await this.matchRepository.findOne(matchId);
    if (match.legs.length == 0) {
      this.legRepository.save(this.legRepository.create({ match: match }));
    }
    const legs = match.legs;
    const leg = legs[legs.length - 1];
    let player1Score = leg.player1Points;
    let player2Score = leg.player2Points;
    let pointsLeft: number;

    if (player == match.player1.userId) {
      pointsLeft = player1Score - points;

      if (pointsLeft > 0) {
        leg.player1Points = pointsLeft;
        await this.connection.manager.save(leg);
      } else if (pointsLeft == 0) {
        leg.player1Points = 0;
        await this.connection.manager.save(leg);
        legs.push(this.legRepository.create({ match: match }));
        await this.connection.manager.save(legs);
      }
    } else {
      pointsLeft = player2Score - points;

      if (pointsLeft > 0) {
        leg.player2Points = pointsLeft;
      } else if (pointsLeft == 0) {
        leg.player2Points = 0;
        await this.connection.manager.save(leg);
        legs.push(this.legRepository.create({ match: match }));
        await this.connection.manager.save(legs);
      }
    }
    await this.connection.manager.save(leg);

    return match;
  }
}
