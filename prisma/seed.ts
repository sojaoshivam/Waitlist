import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.waitlistEntry.deleteMany();
  await prisma.waitlistEntry.createMany({
    data: [
      { email: "alice1@gmail.com", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { email: "bob2@gmail.com", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { email: "carol3@gmail.com", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { email: "dave4@gmail.com", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { email: "eve5@gmail.com", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeded waitlist entries");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  }); 