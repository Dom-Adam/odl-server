import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtGqlAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { LegModule } from './leg/leg.module';
import { VisitModule } from './visit/visit.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MatchModule,
    PubSubModule,
    PrismaModule,
    LegModule,
    VisitModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGqlAuthGuard,
    },
    PrismaService,
  ],
  controllers: [AppController],
})
export class AppModule {}
