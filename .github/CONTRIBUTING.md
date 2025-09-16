
# Contributing Guide



## 🛠 개발 환경 세팅

### Frontend (Next.js)
```bash
cd client
npm install
npm run dev
# http://localhost:3000 접속
````

### Backend (Spring Boot)

```bash
cd back
./gradlew bootRun
# 기본 포트: 8080
```

---

## 🔀 브랜치 규칙

* 기본 브랜치: `main`
* 브랜치는 작업 단위별로 생성합니다.

    * 기능 추가: `feat/<feature-name>`
    * 버그 수정: `fix/<issue-name>`
    * 문서 수정: `docs/<doc-name>`
    * 설정/환경: `chore/<task-name>`

예시:

```
feat/cart-payment
fix/login-token-expire
docs/readme-update
```

---

## 📝 커밋 메시지 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/)을 따릅니다.

* `Feat:` 새로운 기능 추가
* `Fix:` 버그 수정
* `Docs:` 문서 변경
* `Chore:` 빌드/환경/설정
* `Test:` 테스트 코드

예시:

```
Feat: 상품 리뷰 작성 기능 추가
Fix: JWT 만료 시 자동 갱신 버그 수정
Docs: CONTRIBUTING.md 작성
```

---

## ✅ Pull Request 가이드

* PR은 작은 단위로 올려주세요.
* 제목은 커밋 컨벤션을 따릅니다.
* PR 설명에는 **변경 이유/내용, 실행 방법, 스크린샷(있다면)** 을 포함해주세요.
* Merge 전, lint/test 통과를 확인해주세요.

---

## 🙌 코드 스타일

* **Frontend**: ESLint + Prettier, TypeScript strict 모드 유지
* **Backend**: Google Java Format / Checkstyle 권장
* 공통: 비밀정보(.env, application.yml)는 절대 커밋하지 말 것
