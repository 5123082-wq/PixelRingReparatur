import fs from 'fs';
import path from 'path';

const srcDir = 'signage-service/src';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      callback(fullPath);
    }
  });
}

const auditExports = ['requireAdminPermissionActor', 'createAdminAuditLog', 'AdminRequestActor'];
const authExports = ['CMS_SESSION_COOKIE_NAME', 'CRM_SESSION_COOKIE_NAME', 'requireAdminSession', 'getAdminActorBySession', 'verifyAdminPassword'];

walk(srcDir, filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Multi-line regex for imports
  const importRegex = /import\s+\{([\s\S]*?)\}\s+from\s+['"](@\/lib\/admin-(?:auth|audit))['"];/g;
  
  let match;
  let matches = [];
  while ((match = importRegex.exec(content)) !== null) {
      matches.push({
          fullMatch: match[0],
          namesString: match[1],
          source: match[2]
      });
  }

  if (matches.length > 0) {
      let finalAuditNames = new Set();
      let finalAuthNames = new Set();
      
      matches.forEach(m => {
          const names = m.namesString.split(',').map(s => s.trim()).filter(Boolean);
          names.forEach(name => {
              const cleanName = name.replace(/^type\s+/, '').split(/\s+/)[0]; // handle 'as' aliases if any
              if (auditExports.includes(cleanName)) {
                  finalAuditNames.add(name);
              } else if (authExports.includes(cleanName)) {
                  finalAuthNames.add(name);
              } else {
                  if (m.source === '@/lib/admin-auth') finalAuthNames.add(name);
                  else finalAuditNames.add(name);
              }
          });
          content = content.replace(m.fullMatch, '');
      });

      let newImports = [];
      if (finalAuthNames.size > 0) {
          newImports.push(`import { ${Array.from(finalAuthNames).join(', ')} } from '@/lib/admin-auth';`);
      }
      if (finalAuditNames.size > 0) {
          newImports.push(`import { ${Array.from(finalAuditNames).join(', ')} } from '@/lib/admin-audit';`);
      }

      // Clean up multiple newlines at top
      content = newImports.join('\n') + '\n' + content.trimStart();
      
      if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
      }
  }
});
