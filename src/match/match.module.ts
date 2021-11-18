import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchResolver } from './match.resolver';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { MatchSubscriber } from './match.subscriber';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';
import { Leg } from './entities/leg.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Leg]), UserModule, PubSubModule],
  providers: [MatchResolver, MatchService, UserService, MatchSubscriber],
})
export class MatchModule {}
