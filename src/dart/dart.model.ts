import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Dart {
  @Field(() => ID)
  id: string;

  @Field(() => Int, { description: 'the point value of the dart' })
  value: number;

  @Field(() => Int, {
    description: 'the field in which the dart landed',
  })
  field: number;

  @Field(() => Int, {
    description:
      'indicates whether the dart landed in a single a double or a treble',
  })
  segment: number;
}
