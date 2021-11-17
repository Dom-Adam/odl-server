import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtGqlAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MatchModule,
    PubSubModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGqlAuthGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
