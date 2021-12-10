import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  ResolveField,
  Root,
} from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { SkipJwt } from 'src/auth/decorators/public.decorator';
import { User } from './user.model';
import { Match } from 'src/match/match.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @SkipJwt()
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.userService.delete(id);
  }

  @SkipJwt()
  @Subscription(() => Match)
  getMatchId(@Args('id') id: string) {
    return this.pubSub.asyncIterator(`user${id}`);
  }

  @ResolveField()
  async matches(@Root() { id }: User) {
    return this.userService.getMatches(id);
  }

  @ResolveField()
  async legs(@Root() { id }: User) {
    return this.userService.getLegs(id);
  }
}
