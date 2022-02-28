import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMatchInput {
  @Field({ description: 'id of the match that is getting updated' })
  matchId: string;

  @Field({ description: 'id of the leg that is getting updated' })
  legId: string;

  @Field(() => Int, {
    description: 'the field in which the dart landed',
  })
  field: number;

  @Field(() => Int, {
    description: 'indicates whether the dart hit a treble a double or a single',
  })
  segment: number;

  @Field({ description: 'determinates whether the match is finished' })
  isFinished: boolean;
}
