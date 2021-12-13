import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Dart {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  value: number;

  @Field(() => Int)
  field: number;

  @Field(() => Int)
  segment: number;
}
