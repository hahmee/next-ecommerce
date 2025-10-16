#!/usr/bin/env bash
set -euo pipefail

# 브랜치 안전장치
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git checkout -b "hotfix/fsd-repair-$(date +%Y%m%d-%H%M%S)"
fi

ROOT_APP="app"
SRC_APP="src/app"
SRC_PAGES="src/pages"

mkdir -p "$ROOT_APP" "$SRC_PAGES"

echo "== 0) 현재 src/app 잔여 파일 확인 =="
find "$SRC_APP" -type f || true
echo

echo "== 1) 세그먼트 특수 파일(error/not-found/loading/layout/template/@modal/default) 이동(경로 보존) =="
# layout.tsx (루트 제외) + error/not-found/loading/template + @modal/default.tsx
if [ -d "$SRC_APP" ]; then
  while IFS= read -r f; do
    rel="${f#$SRC_APP/}"
    dest="$ROOT_APP/$rel"
    mkdir -p "$(dirname "$dest")"
    if [ -e "$dest" ]; then
      git rm --cached -f "$f" 2>/dev/null || true
      rm -f "$f"
      echo "skip(move exists): $dest ; removed src: $f"
    else
      git mv "$f" "$dest"
      echo "moved: $f -> $dest"
    fi
  done < <(find "$SRC_APP" -type f \( \
       -name 'error.tsx' -o -name 'not-found.tsx' -o -name 'loading.tsx' -o \
       -name 'template.tsx' -o -name 'layout.tsx' -o -path '*/@modal/default.tsx' \
     \) ! -path "$SRC_APP/layout.tsx")
fi
echo

echo "== 2) app/**/page.tsx re-export 생성을 src/pages/**/index.tsx 기준으로 보정 =="
# src/pages/**/index.tsx 하나당 app/**/page.tsx 가 있어야 함
while IFS= read -r idx; do
  rel="${idx#$SRC_PAGES/}"          # e.g. (home)/product/[id]/index.tsx
  seg_dir="$(dirname "$rel")"       # e.g. (home)/product/[id]
  app_page="$ROOT_APP/$seg_dir/page.tsx"
  mkdir -p "$(dirname "$app_page")"
  # 항상 갱신(내용 동일하면 git이 변경 없음으로 처리됨)
  printf "export { default } from '@/pages/%s';\n" "$seg_dir" > "$app_page"
  git add "$app_page"
  echo "ensure re-export: $app_page"
done < <(find "$SRC_PAGES" -type f -name 'index.tsx')
echo

echo "== 3) 혹시 남아있는 src/app/page.tsx 제거(이미 pages로 이전된 케이스) =="
if [ -d "$SRC_APP" ]; then
  while IFS= read -r p; do
    git rm --cached -f "$p" 2>/dev/null || true
    rm -f "$p"
    echo "removed stray src page: $p"
  done < <(find "$SRC_APP" -type f -name 'page.tsx' || true)
fi
echo

echo "== 4) src/app 빈 디렉토리 정리 =="
[ -d "$SRC_APP" ] && find "$SRC_APP" -type d -empty -delete || true
echo

echo "== 5) 검증 가이드 출력 =="
echo "• 남은 src/app 파일이 없어야 정상입니다. 아래로 다시 확인:"
find "$SRC_APP" -type f || true
echo
echo "• app 쪽 page.tsx 개수와 src/pages 쪽 index.tsx 개수가 대략 일치해야 합니다."
echo "  - app/page.tsx  수:   $(find app -type f -name 'page.tsx' | wc -l | tr -d ' ')"
echo "  - src/pages index:    $(find src/pages -type f -name 'index.tsx' | wc -l | tr -d ' ')"
echo
echo "완료. git status로 변경사항 확인 후 빌드 해보세요."
