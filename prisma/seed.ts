import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: 'user1',
      email: 'example1@example.com',
      password: await argon2.hash('password1'),
    },
  });

  await prisma.user.create({
    data: {
      username: 'user2',
      email: 'example2@example.com',
      password: await argon2.hash('password2'),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect);
