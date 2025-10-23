// scripts/generate-feature-barrels.cjs
/*
  Generate barrel index.ts files ONLY at slice roots under src/features/**
  - Do NOT create inside model/, ui/, consts/
  - Each slice index.ts re-exports:
      * files directly in the slice dir
      * files directly under slice/model, slice/ui, slice/consts (one level deep)
*/

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const FEATURES_DIR = path.join(PROJECT_ROOT, 'src', 'features');

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

function posixRelNoExt(from, to) {
  let rel = path.relative(from, to).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel.replace(/(\.tsx?|\.ts)$/, '');
}

function isInternalDir(dir) {
  return INTERNAL_DIRS.has(path.basename(dir));
}

function writeSliceBarrel(sliceDir) {
  // 1) slice root 자체 파일
  const selfFiles = listDirectFiles(sliceDir);

  // 2) model/ui/consts 바로 아래 파일 (1 레벨만)
  const subRoots = listDirectSubdirs(sliceDir).filter((d) => isInternalDir(d));
  const subFiles = subRoots.flatMap((sub) => listDirectFiles(sub));

  const allFiles = [...selfFiles, ...subFiles];
  if (allFiles.length === 0) return false;

  const exports = [];
  const seen = new Set();
  for (const file of allFiles) {
    const rel = posixRelNoExt(sliceDir, file);
    if (seen.has(rel)) continue;
    seen.add(rel);
    exports.push(`export * from '${rel}';`);
  }

  const header =
    '// AUTO-GENERATED FILE. DO NOT EDIT.\n' +
    '// Run: node scripts/generate-feature-barrels.cjs\n\n';
  const content = header + exports.join('\n') + '\n';

  fs.writeFileSync(path.join(sliceDir, 'index.ts'), content, 'utf8');
  return true;
}

function walk(dir) {
  const base = path.basename(dir);

  // model/ui/consts 안으로는 들어가지도, 생성하지도 않음
  if (isInternalDir(dir)) return;

  // 현재 디렉터리를 slice 후보로 처리
  writeSliceBarrel(dir);

  // 하위 디렉터리는 계속 탐색하되, model/ui/consts 는 패스
  for (const sub of listDirectSubdirs(dir)) {
    if (isInternalDir(sub)) continue;
    walk(sub);
  }
}

(function main() {
  if (!fs.existsSync(FEATURES_DIR)) {
    console.error(`Not found: ${FEATURES_DIR}`);
    process.exit(1);
  }
  walk(FEATURES_DIR);
  console.log('✅ Slice-level barrels generated (no barrels inside model/ui/consts).');
})();
