import {
  Parent,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Leg } from 'src/leg/leg.model';
import { LegService } from './leg.service';

@Resolver(() => Leg)
export class LegResolver {
  constructor(private legService: LegService) {}

  @ResolveField()
  async points(@Root() { id }: Leg) {
    console.log('points resolver called');

    return await this.legService.getPoints(id);
  }

  @ResolveField()
  match(@Parent() { matchId, id }: Leg) {
    return this.legService.getMatch(matchId, id);
  }
}
