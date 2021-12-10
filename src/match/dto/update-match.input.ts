import { CreateMatchInput } from './create-match.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMatchInput extends PartialType(CreateMatchInput) {
  @Field(() => Int)
  pointsScored: number;

  matchId: string;

  player: string;

  legId: string;
}
