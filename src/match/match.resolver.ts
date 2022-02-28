import { Inject, UseGuards } from '@nestjs/common';
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
import { CurrentUser } from 'src/auth/decorators/current_user.decorator';
import { SkipJwt } from 'src/auth/decorators/public.decorator';
import { JwtGqlAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateMatchInput } from './dto/update-match.input';
import { Match } from './match.model';
import { MatchService } from './match.service';

@Resolver(() => Match)
export class MatchResolver {
  constructor(
    private matchService: MatchService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Query(() => [Match], { name: 'matches', description: 'gets all matches' })
  findAll() {
    return this.matchService.findAll();
  }

  @Query(() => Match, { name: 'match', description: 'gets match by its id' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.matchService.findOne(id);
  }

  @Mutation(() => Match, { description: 'updates match with specified data' })
  updateMatch(
    @Args('updateMatchInput')
    { matchId, legId, field, segment, isFinished }: UpdateMatchInput,
    @CurrentUser() user: any,
  ) {
    return this.matchService.handleVisit(
      field,
      segment,
      matchId,
      user.userId,
      legId,
      isFinished,
    );
  }

  @Mutation(() => String, { description: 'starts search for opponent' })
  @UseGuards(JwtGqlAuthGuard)
  searchOpponent(@CurrentUser() user: any) {
    console.log(`${user.username} search opponent`);
    console.log(user);

    return this.matchService.searchOpponent(user.userId);
  }

  @SkipJwt()
  @Subscription(() => Match, {
    description:
      'listens to updates of the match that corresponds to the specified id',
  })
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
