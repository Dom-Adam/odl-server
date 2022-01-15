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
  Context,
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
    { matchId, legId, field, segment }: UpdateMatchInput,
    @CurrentUser() user: any,
  ) {
    return this.matchService.handleVisit(
      field,
      segment,
      matchId,
      user.userId,
      legId,
    );
  }

  @Mutation(() => String)
  @UseGuards(JwtGqlAuthGuard)
  searchOpponent(@CurrentUser() user: any) {
    console.log(user);

    return this.matchService.searchOpponent(user.userId);
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
