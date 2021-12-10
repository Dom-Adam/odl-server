import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Visit {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  score: number;

  legId: string;

  playerId: string;
}
