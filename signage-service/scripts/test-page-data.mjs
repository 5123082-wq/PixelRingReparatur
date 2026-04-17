import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function test() {
  const locale = 'ru';
  const pageKey = 'home';
  
  console.log(`Checking page: ${pageKey} [${locale}]...`);
  
  try {
    const page = await prisma.cmsPage.findFirst({
      where: {
        pageKey,
        locale,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        blocks: true,
      },
    });

    if (!page) {
      console.log('Page NOT FOUND');
      return;
    }

    console.log('Page found:', page.title);
    console.log('Blocks count:', page.blocks.length);
    
    const trustBlock = page.blocks.find(b => b.key === 'trustSection');
    if (trustBlock) {
      console.log('Trust Block Data:', JSON.stringify(trustBlock.data, null, 2));
    } else {
      console.log('Trust Block NOT FOUND in blocks array');
    }

  } catch (error) {
    console.error('CRITICAL ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
