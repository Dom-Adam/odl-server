import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Match } from './entities/match.entity';

@EventSubscriber()
export class MatchSubscriber implements EntitySubscriberInterface<Match> {
  constructor(
    connection: Connection,

    @Inject('PUB_SUB')
    private pubSub: PubSub,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): string | Function {
    return Match;
  }

  afterInsert(event: InsertEvent<Match>) {
    console.log('afterInsert called');

    const player1Id = event.entity.player1.userId;
    const player2Id = event.entity.player2.userId;
    const match = event.entity.matchId;

    this.pubSub.publish(`user${player1Id}`, { getMatchId: match });
    this.pubSub.publish(`user${player2Id}`, { getMatchId: match });
  }
}
