import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

async function main() {
  const { prisma } = await import('../src/lib/prisma.ts');
  const { createAdminSession } = await import('../src/lib/admin-auth.ts');

  // Find an active OWNER user
  const owner = await prisma.adminUser.findFirst({
    where: { role: 'OWNER', status: 'ACTIVE' }
  });

  if (!owner) {
    console.error('No active OWNER admin user found in database.');
    process.exit(1);
  }

  // Create a temporary session
  const token = await createAdminSession(prisma, {
    adminUserId: owner.id,
    role: 'OWNER',
    label: 'Temp diagnostic session',
    ipAddress: '127.0.0.1',
    userAgent: 'diagnostic-script'
  });

  console.log('Generated session token:', token);
  
  // Make HTTP request using global fetch
  const targetUrl = 'http://localhost:3000/de/service?cmsPreview=1';
  console.log('Fetching:', targetUrl);
  
  const response = await fetch(targetUrl, {
    headers: {
      'Cookie': `pixelring_cms_session=${token}`
    }
  });

  console.log('HTTP Status:', response.status);
  console.log('HTTP Headers:');
  for (const [key, val] of response.headers.entries()) {
    console.log(`  ${key}: ${val}`);
  }

  const html = await response.text();
  console.log('\n--- First 300 characters of response HTML ---');
  console.log(html.substring(0, 500));

  // Clean up the temp session
  const { hashAdminToken } = await import('../src/lib/admin-auth.ts');
  const tokenHash = hashAdminToken(token);
  await prisma.adminSession.delete({
    where: { tokenHash }
  });
  console.log('\nCleaned up the temporary session.');
}

main().catch(console.error);
