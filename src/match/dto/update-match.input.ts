import { CreateMatchInput } from './create-match.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMatchInput extends PartialType(CreateMatchInput) {
  matchId: string;

  legId: string;

  @Field(() => Int)
  field: number;

  @Field(() => Int)
  segment: number;
}
