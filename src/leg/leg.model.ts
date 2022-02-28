import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Match } from 'src/match/match.model';
import { Visit } from 'src/visit/visit.model';

@ObjectType()
export class Leg {
  @Field(() => ID)
  id: string;

  @Field({ description: 'id of the match to which the leg belongs' })
  matchId: string;

  @Field(() => Match, { description: 'match to which the leg belongs' })
  match: Match;

  @Field({ description: 'boolean indicating wether the leg is finished' })
  isFinished: boolean;

  @Field(() => [Int], {
    description:
      'array where each element represents the points left in the leg for the user at the same index in players array of the match',
  })
  points: number[];

  @Field(() => [Visit], { description: 'the visits that belong to the leg' })
  visits: Visit[];

  playerId: string;
}
