#!/usr/bin/env bash
set -euo pipefail

echo "== FSD(App Router 얇게 + src/pages 구현) 리팩토링 시작 =="

# 0) Git 브랜치
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "이 디렉토리는 Git 리포지토리가 아닙니다."; exit 1
fi
BRANCH="refactor/fsd-no-bff-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BRANCH"

ROOT_APP="app"
SRC_APP="src/app"
SRC_PAGES="src/pages"

mkdir -p "$ROOT_APP"
mkdir -p "$SRC_PAGES"

# 1) 루트 /pages (빈)
mkdir -p pages
if [ ! -f pages/README.md ]; then
  cat > pages/README.md <<'EOF'
# Empty on purpose
This folder disables Next.js Pages Router while using App Router at /app.
EOF
  git add pages/README.md
fi

# 2) 전역/특수 파일을 루트 /app 으로 이동 (이미 있으면 소스 제거)
SPECIAL_FILES=( "layout.tsx" "error.tsx" "loading.tsx" "not-found.tsx" "sitemap.ts" "globals.css" )
for f in "${SPECIAL_FILES[@]}"; do
  SRC="$SRC_APP/$f"
  DEST="$ROOT_APP/$f"
  if [ -f "$SRC" ]; then
    mkdir -p "$(dirname "$DEST")"
    if [ -e "$DEST" ]; then
      # 목적지가 이미 있으면 소스만 제거
      git rm --cached -f "$SRC" 2>/dev/null || true
      rm -f "$SRC"
      echo "skip move (exists): $DEST ; removed source $SRC"
    else
      git mv "$SRC" "$DEST"
      echo "moved: $SRC -> $DEST"
    fi
  fi
done

# 3) route group 내부 layout.tsx / @modal/default.tsx 이동 (이미 있으면 소스 제거)
# layout.tsx
if [ -d "$SRC_APP" ]; then
  find "$SRC_APP" -type f -name "layout.tsx" ! -path "$SRC_APP/layout.tsx" | while read -r L; do
    REL="${L#$SRC_APP/}"
    DEST="$ROOT_APP/$REL"
    mkdir -p "$(dirname "$DEST")"
    if [ -e "$DEST" ]; then
      git rm --cached -f "$L" 2>/dev/null || true
      rm -f "$L"
      echo "skip move (exists): $DEST ; removed source $L"
    else
      git mv "$L" "$DEST"
      echo "moved: $L -> $DEST"
    fi
  done

  # @modal/default.tsx
  find "$SRC_APP" -type f -path "*/@modal/default.tsx" | while read -r M; do
    REL="${M#$SRC_APP/}"
    DEST="$ROOT_APP/$REL"
    mkdir -p "$(dirname "$DEST")"
    if [ -e "$DEST" ]; then
      git rm --cached -f "$M" 2>/dev/null || true
      rm -f "$M"
      echo "skip move (exists): $DEST ; removed source $M"
    else
      git mv "$M" "$DEST"
      echo "moved: $M -> $DEST"
    fi
  done
fi

# 4) API 라우트 이동 (이미 있으면 소스 제거)
if [ -d "$SRC_APP/api" ]; then
  find "$SRC_APP/api" -type f | while read -r A; do
    REL="${A#$SRC_APP/}"
    DEST="$ROOT_APP/$REL"
    mkdir -p "$(dirname "$DEST")"
    if [ -e "$DEST" ]; then
      git rm --cached -f "$A" 2>/dev/null || true
      rm -f "$A"
      echo "skip move (exists): $DEST ; removed source $A"
    else
      git mv "$A" "$DEST"
      echo "moved: $A -> $DEST"
    fi
  done
  # 빈 디렉토리 정리
  find "$SRC_APP/api" -type d -empty -delete || true
fi

# 5) 모든 page.tsx → src/pages/**/index.tsx 로 이동 + app/**/page.tsx 재생성(re-export)
if [ -d "$SRC_APP" ]; then
  find "$SRC_APP" -type f -name "page.tsx" | while read -r SRCFILE; do
    REL="${SRCFILE#$SRC_APP/}"               # (home)/product/[id]/page.tsx
    DEST_DIR="$SRC_PAGES/$(dirname "$REL")"  # src/pages/(home)/product/[id]
    DEST_FILE="$DEST_DIR/index.tsx"          # .../index.tsx
    APP_PAGE="$ROOT_APP/$REL"                # app/(home)/product/[id]/page.tsx

    mkdir -p "$DEST_DIR"

    # 페이지 구현 이동 (이미 있으면 소스 제거)
    if [ -e "$DEST_FILE" ]; then
      git rm --cached -f "$SRCFILE" 2>/dev/null || true
      rm -f "$SRCFILE"
      echo "skip move (exists): $DEST_FILE ; removed source $SRCFILE"
    else
      git mv "$SRCFILE" "$DEST_FILE"
      echo "moved: $SRCFILE -> $DEST_FILE"
    fi

    # app 쪽 re-export 생성/갱신
    mkdir -p "$(dirname "$APP_PAGE")"
    cat > "$APP_PAGE" <<EOF
export { default } from '@/pages/$(dirname "$REL")';
EOF
    git add "$APP_PAGE"
    echo "created/updated re-export: $APP_PAGE"
  done
fi

# 6) src/bff 제거(있다면)
if [ -d "src/bff" ]; then
  git rm -r "src/bff"
  echo "removed: src/bff"
fi

# 7) 빈 디렉토리 정리
if [ -d "$SRC_APP" ]; then
  find "$SRC_APP" -type d -empty -delete || true
fi

echo "== 변경사항 요약 =="
git status --porcelain
echo
echo "✅ 완료! 작업 브랜치: $BRANCH"
echo "다음 단계:"
echo " 1) /app/api/**/route.ts 를 features/entities/shared 로 re-export 하도록 점진 이관"
echo " 2) tsconfig.json paths 갱신"
