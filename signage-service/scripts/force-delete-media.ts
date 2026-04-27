
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetId = '6d4fe0ca-42c1-4764-b1c5-a3c2acbff281'; // ID for 'Test Simulated Failure'
  
  console.log(`Checking asset: ${targetId}`);
  
  const asset = await prisma.cmsMedia.findUnique({
    where: { id: targetId }
  });
  
  if (!asset) {
    console.log('Asset not found.');
    return;
  }
  
  console.log('Asset found:', asset.title);
  
  if (asset.deletedAt) {
    console.log('Asset is already marked as deleted at:', asset.deletedAt);
    return;
  }

  console.log('Attempting soft delete...');
  const updated = await prisma.cmsMedia.update({
    where: { id: targetId },
    data: { deletedAt: new Date() }
  });
  
  console.log('Success! Asset marked as deleted.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
