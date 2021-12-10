import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import * as argon2 from 'argon2';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    let hashedPassword: string;
    try {
      hashedPassword = await argon2.hash(createUserInput.password);
    } catch (e) {
      console.log(e);
    }

    return await this.prisma.user.create({
      data: {
        ...createUserInput,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(updateUserInput: UpdateUserInput) {
    return await this.prisma.user.update({
      where: { id: updateUserInput.id },
      data: { ...updateUserInput },
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async getMatches(id: string) {
    const matches = await this.prisma.user
      .findUnique({ where: { id } })
      .matches({ select: { match: true } });

    return matches.map((ele) => ele.match);
  }

  async getLegs(id: string) {
    const legs = await this.prisma.user
      .findUnique({ where: { id } })
      .legs({ select: { leg: true } });

    return legs.map((ele) => ele.leg);
  }
}
