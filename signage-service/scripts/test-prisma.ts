import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Testing Prisma connection...');
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Connection successful:', result);
    
    const count = await prisma.message.count();
    console.log('Message count:', count);
  } catch (error) {
    console.error('Prisma test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
