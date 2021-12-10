import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Match } from 'src/match/match.model';

@ObjectType()
export class Leg {
  @Field(() => ID)
  id: string;

  matchId: string;

  match: Match;

  isFinished: boolean;

  @Field(() => [Int])
  points: number[];
}
