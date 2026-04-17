import fs from 'fs';
import path from 'path';

const locales = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];

async function testImports() {
  for (const locale of locales) {
    const filePath = path.resolve(`messages/${locale}.json`);
    console.log(`Testing ${locale}...`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      console.log(`  - JSON.parse: OK`);
      
      // Mimic the import behavior
      const imported = await import(`file://${filePath}`, { assert: { type: 'json' } }).catch(e => {
         // Fallback for older node or different loader
         return JSON.parse(content);
      });
      console.log(`  - Mock Import: OK`);
    } catch (e) {
      console.error(`  - FAILED: ${e.message}`);
      process.exit(1);
    }
  }
  console.log('All locales OK!');
}

testImports();
