
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const media = await prisma.cmsMedia.findMany({
    where: { title: 'Test Simulated Failure' }
  });
  console.log(JSON.stringify(media, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
