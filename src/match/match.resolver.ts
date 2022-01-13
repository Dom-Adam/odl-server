import { Inject } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Root,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { SkipJwt } from 'src/auth/decorators/public.decorator';
import { UpdateMatchInput } from './dto/update-match.input';
import { Match } from './match.model';
import { MatchService } from './match.service';

@Resolver(() => Match)
export class MatchResolver {
  constructor(
    private matchService: MatchService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Query(() => [Match], { name: 'matches' })
  findAll() {
    return this.matchService.findAll();
  }

  @Query(() => Match, { name: 'match' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.matchService.findOne(id);
  }

  @Mutation(() => Match)
  updateMatch(
    @Args('updateMatchInput')
    { matchId, player, legId, field, segment }: UpdateMatchInput,
  ) {
    return this.matchService.handleVisit(
      field,
      segment,
      matchId,
      player,
      legId,
    );
  }

  @Mutation(() => String)
  searchOpponent(@Args('user', { type: () => ID }) user: string) {
    return this.matchService.searchOpponent(user);
  }

  @SkipJwt()
  @Subscription(() => Match)
  listenToMatch(@Args('matchId') matchId: string) {
    return this.pubSub.asyncIterator(`match${matchId}`);
  }

  @ResolveField()
  players(@Root() { id }: Match) {
    return this.matchService.getPlayers(id);
  }

  @ResolveField()
  legs(@Root() { id }: Match) {
    return this.matchService.getLegs(id);
  }
}
