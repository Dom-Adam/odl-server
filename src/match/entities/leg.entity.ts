import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from './match.entity';

@Entity()
@ObjectType()
export class Leg {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  legId: number;

  @Column({ default: 501 })
  @Field(() => Int)
  player1Points: number;

  @Column({ default: 501 })
  @Field(() => Int)
  player2Points: number;

  @ManyToOne(() => Match, (match) => match.legs)
  match: Match;
}
