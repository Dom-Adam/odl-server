import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Leg } from 'src/leg/leg.model';
import { Match } from 'src/match/match.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  username: string;

  email: string;

  matches: Match[];

  legs: Leg[];
}
