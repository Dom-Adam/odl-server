import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { Leg } from '../leg/leg.model';

@ObjectType()
export class Match {
  @Field(() => ID)
  id: string;

  players: User[];

  legs: Leg[];

  isFinished: boolean;
}
