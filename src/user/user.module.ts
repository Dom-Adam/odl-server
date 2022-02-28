import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';

@Module({
  imports: [PubSubModule],
  providers: [UserResolver, PrismaService, UserService],
})
export class UserModule {}
