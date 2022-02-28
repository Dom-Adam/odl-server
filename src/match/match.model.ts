import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { Leg } from '../leg/leg.model';

@ObjectType()
export class Match {
  @Field(() => ID)
  id: string;

  @Field(() => [User], { description: 'the participants of the match' })
  players: User[];

  @Field(() => [Leg], { description: 'the legs of the match' })
  legs: Leg[];

  @Field({ description: 'a boolean that indicates if the match is finished' })
  isFinished: boolean;
}
