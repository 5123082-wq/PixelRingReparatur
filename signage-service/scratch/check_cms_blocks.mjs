
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

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
  const blocks = Array.isArray(page.blocks) ? page.blocks : [];
  console.log('Blocks Count:', blocks.length);
  
  const coverageBlock = blocks.find((block) => isRecord(block) && block.key === 'coverageSection');
  
  if (coverageBlock) {
    console.log('Coverage Block found:');
    console.log(JSON.stringify(coverageBlock, null, 2));
  } else {
    console.log('Coverage Block NOT FOUND in blocks list.');
    console.log(
      'Available keys:',
      blocks
        .map((block) => (isRecord(block) && typeof block.key === 'string' ? block.key : null))
        .filter(Boolean)
        .join(', ')
    );
  }
}

checkCms()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
