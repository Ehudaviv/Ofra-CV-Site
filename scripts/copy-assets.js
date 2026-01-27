import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Folders to copy
const foldersToCopy = [
  'תמונות',
  'מאמרים',
  'ציורים בהנחייתי'
];

function copyRecursive(src, dest) {
  try {
    const stat = statSync(src);
    
    if (stat.isDirectory()) {
      // Create directory if it doesn't exist
      try {
        mkdirSync(dest, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
      
      // Copy all files in directory
      const files = readdirSync(src);
      for (const file of files) {
        copyRecursive(join(src, file), join(dest, file));
      }
    } else {
      // Copy file
      copyFileSync(src, dest);
      console.log(`Copied: ${src} -> ${dest}`);
    }
  } catch (err) {
    console.error(`Error copying ${src}:`, err.message);
  }
}

console.log('Copying asset folders to dist...');

for (const folder of foldersToCopy) {
  const srcPath = join(rootDir, folder);
  const destPath = join(distDir, folder);
  
  console.log(`\nCopying ${folder}...`);
  copyRecursive(srcPath, destPath);
}

console.log('\nAsset folders copied successfully!');
