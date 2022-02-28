import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Dart } from 'src/dart/dart.model';

@ObjectType()
export class Visit {
  @Field(() => ID)
  id: string;

  @Field(() => [Dart], { description: 'the darts that belong to the visit' })
  darts: Dart[];

  @Field({ description: 'the id of the leg to which the visit belongs' })
  legId: string;

  @Field({ description: 'the id of the player to whom the visit belongs' })
  playerId: string;

  @Field({ description: 'boolean indicating wether the visit is finished' })
  isFinished: boolean;
}
