import { InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  userName: string;

  @IsEmail()
  email: string;

  password: string;
}
