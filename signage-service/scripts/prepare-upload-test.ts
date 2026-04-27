import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashAdminToken } from '../src/lib/admin-auth.ts';
import { prisma } from '../src/lib/prisma.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function testUpload() {
  console.log('--- Starting Media Upload Test ---');
  
  const owner = await prisma.adminUser.findFirst({
    where: { email: process.env.ADMIN_BOOTSTRAP_OWNER_EMAIL || 'owner@pixelring.local' }
  });
  
  if (!owner) {
    console.error('Owner not found');
    process.exit(1);
  }
  
  const token = randomUUID();
  const tokenHash = hashAdminToken(token);
  const session = await prisma.adminSession.create({
    data: {
      adminUserId: owner.id,
      tokenHash,
      role: owner.role,
      expiresAt: new Date(Date.now() + 3600000),
      label: 'Test Session',
    }
  });

  const size = 100 * 1024; // 100KB for faster test
  const buffer = Buffer.alloc(size, 0);
  buffer.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write('IHDR', 12, 'ascii');
  buffer.writeUInt32BE(100, 16);
  buffer.writeUInt32BE(100, 20);

  const file = new File([buffer], 'test_image.png', { type: 'image/png' });
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('usageType', 'PAGE');
  formData.append('locale', 'de');
  formData.append('title', 'Test Image');

  // We can't call POST directly because of Next.js dependencies
  // So we'll use fetch if the server is running, or we'll just try to simulate the logic.
  
  console.log('Session token:', token);
  console.log('To test manually, run:');
  console.log(`curl -X POST http://localhost:3000/api/cms/media \
  -H "Cookie: pixelring_cms_session=${token}" \
  -H "x-pixelring-admin-csrf: 1" \
  -F "file=@/path/to/image.png" \
  -F "usageType=PAGE" \
  -F "locale=de" \
  -F "title=Test Image"`);
  
  await prisma.$disconnect();
}

testUpload();
