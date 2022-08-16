import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      id: 1,
      posts: {
        create: {
          title: "Hello World",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: 2,
      posts: {
        create: {
          title: "Hello World",
        },
      },
    },
  });

  const usersBeforeDelete = await prisma.user.findMany();
  const postsBeforeDelete = await prisma.post.findMany();

  console.log({ usersBeforeDelete, postsBeforeDelete });

  console.log("----------------");

  const models = Object.keys(prisma).filter((key) => key[0] !== "_");

  // await prisma.$queryRaw`SET session_replication_role = 'replica'`;
  await prisma.$queryRaw`PRAGMA foreign_keys = OFF`;

  await Promise.all(
    models.map((name) => {
      // @ts-expect-error
      return prisma[name].deleteMany();
    })
  );

  // await prisma.$queryRaw`SET session_replication_role = 'origin'`;
  await prisma.$queryRaw`PRAGMA foreign_keys = ON`;

  const usersAfterDelete = await prisma.user.findMany();
  const postsAfterDelete = await prisma.post.findMany();

  console.log({ usersAfterDelete, postsAfterDelete });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
