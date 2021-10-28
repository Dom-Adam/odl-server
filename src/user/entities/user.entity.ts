import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  userId: number;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @HideField()
  password: string;
}
