import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Leg } from 'src/leg/leg.model';
import { Match } from 'src/match/match.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field({ description: 'the username of the user' })
  username: string;

  @Field({ description: 'the email address of the user' })
  email: string;

  @Field(() => [Match], { description: 'all matches the user ever played' })
  matches: Match[];

  @Field(() => [Leg], { description: 'all legs the user ever played' })
  legs: Leg[];
}
