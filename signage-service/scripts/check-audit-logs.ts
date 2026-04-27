import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import { prisma } from '../src/lib/prisma.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env.local') });
dotenv.config({ path: path.join(projectRoot, '.env') });

async function checkLogs() {
  try {
    const logs = await prisma.adminAuditLog.findMany({
      where: { action: 'CMS_MEDIA_UPLOAD' },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log(JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogs();
