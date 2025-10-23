// scripts/add-file-headers.js
const fs = require('fs');
const path = require('path');

const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'];
const ROOT_DIR = path.resolve('app');

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (TARGET_EXTENSIONS.includes(path.extname(file))) {
      addHeader(fullPath);
    }
  }
}

function addHeader(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

  const header = `// ${relativePath}`;
  if (!content.startsWith(header)) {
    const updated = `${header}\n\n${content}`;
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ Added header: ${relativePath}`);
  } else {
    console.log(`↔️  Already has header: ${relativePath}`);
  }
}

walk(ROOT_DIR);
