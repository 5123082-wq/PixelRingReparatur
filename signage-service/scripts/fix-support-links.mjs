import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing /support links in global pages...');

  const globalPages = await prisma.cmsPage.findMany({
    where: { slug: 'global' },
    include: { blocks: { include: { block: { include: { fields: true } } } } },
  });

  for (const page of globalPages) {
    const supportBlockRel = page.blocks.find(b => b.block.fields.some(f => f.name === 'name' && f.value === 'footerSupport'));
    if (supportBlockRel) {
      const itemsField = supportBlockRel.block.fields.find(f => f.name === 'items' && f.type === 'LIST');
      if (itemsField && itemsField.value) {
        let items;
        try {
          items = JSON.parse(itemsField.value);
        } catch {
          continue;
        }

        let changed = false;
        items = items.map(item => {
          if (item.href === '/support' || item.href === '/support#symptoms') {
            changed = true;
            return { ...item, href: '/probleme-loesungen' };
          }
          return item;
        });

        if (changed) {
          await prisma.cmsField.update({
            where: { id: itemsField.id },
            data: { value: JSON.stringify(items) },
          });
          console.log(`Updated footerSupport for global page in locale ${page.locale}`);
        }
      }
    }

    // Also fix navigation links if they have /support
    const navBlockRel = page.blocks.find(b => b.block.fields.some(f => f.name === 'name' && f.value === 'navigation'));
    if (navBlockRel) {
      const itemsField = navBlockRel.block.fields.find(f => f.name === 'links' && f.type === 'LIST');
      if (itemsField && itemsField.value) {
        let items;
        try {
          items = JSON.parse(itemsField.value);
        } catch {
          continue;
        }

        let changed = false;
        items = items.map(item => {
          if (item.href === '/support' || item.href === '/support#symptoms') {
            changed = true;
            return { ...item, href: '/probleme-loesungen' };
          }
          return item;
        });

        if (changed) {
          await prisma.cmsField.update({
            where: { id: itemsField.id },
            data: { value: JSON.stringify(items) },
          });
          console.log(`Updated navigation links for global page in locale ${page.locale}`);
        }
      }
    }
  }

  console.log('Done.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
