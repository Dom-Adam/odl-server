import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Leg } from './leg.entity';

@Entity()
@ObjectType()
export class Match {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  matchId: number;

  @ManyToOne(() => User, { eager: true })
  player1: User;

  @ManyToOne(() => User, { eager: true })
  player2: User;

  @OneToMany(() => Leg, (legs) => legs.match, { eager: true })
  legs: Leg[];
}
