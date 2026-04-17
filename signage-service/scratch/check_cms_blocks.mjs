
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCms() {
  const page = await prisma.cmsPage.findFirst({
    where: {
      pageKey: 'home',
      locale: 'de',
      status: 'PUBLISHED',
      deletedAt: null,
    },
  });

  if (!page) {
    console.log('No published home page found for locale "de"');
    return;
  }

  console.log('Page Title:', page.title);
  console.log('Blocks Count:', page.blocks ? (page.blocks as any[]).length : 0);
  
  const blocks = page.blocks as any[];
  const coverageBlock = blocks.find(b => b.key === 'coverageSection');
  
  if (coverageBlock) {
    console.log('Coverage Block found:');
    console.log(JSON.stringify(coverageBlock, null, 2));
  } else {
    console.log('Coverage Block NOT FOUND in blocks list.');
    console.log('Available keys:', blocks.map(b => b.key).join(', '));
  }
}

checkCms()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
