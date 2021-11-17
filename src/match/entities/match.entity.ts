import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
