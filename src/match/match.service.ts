import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { UpdateMatchInput } from './dto/update-match.input';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private userService: UserService,
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
    const match = await this.matchRepository.create({
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
}
