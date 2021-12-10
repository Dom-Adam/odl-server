import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Root,
} from '@nestjs/graphql';
import { UpdateMatchInput } from './dto/update-match.input';
import { Match } from './match.model';
import { MatchService } from './match.service';

@Resolver(() => Match)
export class MatchResolver {
  constructor(private matchService: MatchService) {}

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
    { pointsScored, matchId, player, legId }: UpdateMatchInput,
  ) {
    return this.matchService.handleVisit(pointsScored, matchId, player, legId);
  }

  @Mutation(() => String)
  searchOpponent(@Args('user', { type: () => ID }) user: string) {
    return this.matchService.searchOpponent(user);
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
