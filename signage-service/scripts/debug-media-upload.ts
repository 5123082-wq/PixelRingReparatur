import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { prisma } from '../src/lib/prisma.ts';
import { createAdminSession } from '../src/lib/admin-auth.ts';
import { POST } from '../src/app/api/cms/media/route.ts';
import { NextRequest } from 'next/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env.local') });
dotenv.config({ path: path.join(projectRoot, '.env') });

async function debugUpload() {
  console.log('--- Starting Media Upload Debug ---');
  
  const owner = await prisma.adminUser.findFirst({
    where: { email: process.env.ADMIN_BOOTSTRAP_OWNER_EMAIL || 'owner@pixelring.local' }
  });
  
  if (!owner) {
    console.error('Owner not found');
    process.exit(1);
  }
  
  const token = await createAdminSession(prisma, {
    adminUserId: owner.id,
    role: 'OWNER',
    label: 'Debug Session'
  });
  
  console.log('Created debug session:', token);

  const size = 2000 * 1024; // 2MB
  const buffer = Buffer.alloc(size, 0x00);
  buffer.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write('IHDR', 12, 'ascii');
  buffer.writeUInt32BE(1680, 16);
  buffer.writeUInt32BE(1260, 20);
  
  const blob = new Blob([buffer], { type: 'image/png' });
  const file = new File([blob], 'image_1x.png', { type: 'image/png' });
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('usageType', 'PAGE');
  formData.append('locale', 'de');
  formData.append('title', 'Debug Title');

  const request = new NextRequest('http://localhost/api/cms/media', {
    method: 'POST',
    body: formData,
    headers: {
      'cookie': `pixelring_cms_session=${token}`,
      'x-pixelring-admin-csrf': '1',
      'origin': 'http://localhost'
    }
  });

  try {
    console.log('Calling POST handler...');
    const response = await POST(request);
    console.log('Response Status:', response.status);
    const body = await response.json();
    console.log('Response Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('CRASH in handler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUpload();
