import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Dart } from 'src/dart/dart.model';

@ObjectType()
export class Visit {
  @Field(() => ID)
  id: string;

  darts: Dart[];

  legId: string;

  playerId: string;

  isFinished: boolean
}
