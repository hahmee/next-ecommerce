// scripts/generate-barrels.cjs
/*
  Generate slice-level barrel index.ts files for a base directory (e.g., src/features or src/widgets)

  - Only create at slice roots (ex: src/widgets/admin/categories-table)
  - Never create inside model/, ui/, consts/
  - Each slice index.ts re-exports:
      * files directly in the slice dir
      * files directly under slice/model, slice/ui, slice/consts (one level)
  - Optional: --alias-defaults → if a file contains 'export default', add "export { default as Name } from './path';"
    * Name is inferred from the filename (e.g., './ui/OrderTable.tsx' → 'OrderTable')
*/

const fs = require('fs');
const path = require('path');

// ===== CLI ARGS =====
const args = process.argv.slice(2);
function argVal(flag, def) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}
const BASE_DIR = argVal('--base', 'src/widgets'); // <-- 기본값을 widgets로
const ALIAS_DEFAULTS = args.includes('--alias-defaults');

const PROJECT_ROOT = process.cwd();
const ROOT_DIR = path.join(PROJECT_ROOT, BASE_DIR);

const EXTS = ['.ts', '.tsx'];
const SKIP_FILE_PATTERNS = [
  /^index\.tsx?$/i,
  /\.d\.ts$/i,
  /\.test\.tsx?$/i,
  /\.spec\.tsx?$/i,
  /\.stories\.tsx?$/i,
];
const INTERNAL_DIRS = new Set(['model', 'ui', 'consts']);

function isExportableFile(file) {
  const ext = path.extname(file);
  if (!EXTS.includes(ext)) return false;
  return !SKIP_FILE_PATTERNS.some((re) => re.test(path.basename(file)));
}

function listDirectFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => path.join(dir, d.name))
    .filter(isExportableFile);
}

function listDirectSubdirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(dir, d.name));
}

function isInternalDir(dir) {
  return INTERNAL_DIRS.has(path.basename(dir));
}

function posixRelNoExt(from, to) {
  let rel = path.relative(from, to).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel.replace(/\.(tsx?|ts)$/, '');
}

function filenameToIdent(p) {
  const base = path.basename(p).replace(/\.(tsx?|ts)$/, '');
  // PascalCase 보정 정도만
  return base
    .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

function hasDefaultExport(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    return /\bexport\s+default\b/.test(txt);
  } catch {
    return false;
  }
}

function writeSliceBarrel(sliceDir) {
  const selfFiles = listDirectFiles(sliceDir);
  const subRoots = listDirectSubdirs(sliceDir).filter(isInternalDir);
  const subFiles = subRoots.flatMap((sub) => listDirectFiles(sub));

  const allFiles = [...selfFiles, ...subFiles];
  if (allFiles.length === 0) return false;

  const exportLines = [];
  const aliasLines = [];
  const seen = new Set();

  for (const file of allFiles) {
    const rel = posixRelNoExt(sliceDir, file);
    if (seen.has(rel)) continue;
    seen.add(rel);
    exportLines.push(`export * from '${rel}';`);

    if (ALIAS_DEFAULTS && hasDefaultExport(file)) {
      const name = filenameToIdent(file);
      aliasLines.push(`export { default as ${name} } from '${rel}';`);
    }
  }

  const header =
    '// AUTO-GENERATED FILE. DO NOT EDIT.\n' +
    `// Run: node scripts/generate-barrels.cjs --base ${BASE_DIR}${ALIAS_DEFAULTS ? ' --alias-defaults' : ''}\n\n`;

  const content =
    header +
    exportLines.join('\n') +
    (aliasLines.length ? '\n\n' + aliasLines.join('\n') : '') +
    '\n';
  fs.writeFileSync(path.join(sliceDir, 'index.ts'), content, 'utf8');
  return true;
}

function walk(dir) {
  // model/ui/consts 안에는 생성도 탐색도 안 함
  if (isInternalDir(dir)) return;

  // 현재 디렉터리 = slice 루트 후보
  writeSliceBarrel(dir);

  for (const sub of listDirectSubdirs(dir)) {
    if (isInternalDir(sub)) continue;
    walk(sub);
  }
}

(function main() {
  if (!fs.existsSync(ROOT_DIR)) {
    console.error(`Not found: ${ROOT_DIR}`);
    process.exit(1);
  }
  walk(ROOT_DIR);
  console.log(
    `✅ Barrel generation complete for ${BASE_DIR}${ALIAS_DEFAULTS ? ' (with default aliases)' : ''}.`,
  );
})();
