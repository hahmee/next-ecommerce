# Next.js + Spring Boot Ecommerce Project

<!-- Frontend -->
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-Store-yellow)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.x-FF4154)
![Jest](https://img.shields.io/badge/Jest-29-C21325?logo=jest)
![Cypress](https://img.shields.io/badge/Cypress-14-17202C?logo=cypress)

<!-- Backend -->
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.4-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-007396?logo=java&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C?logo=hibernate)
![MariaDB](https://img.shields.io/badge/MariaDB-10.x-003545?logo=mariadb)
![Lombok](https://img.shields.io/badge/Lombok-annotationProcessor-orange)
![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F)

<!-- Infra & DevOps -->
![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS-S3-569A31?logo=amazons3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-24-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?logo=githubactions&logoColor=white)

## 프로젝트 개요
Next.js와 Spring Boot 기반의 쇼핑몰 플랫폼 구축 프로젝트

- 중소 브랜드를 위한 쇼핑몰 구축 (상품 등록 → 결제까지 풀플로우 구현)
- **SSR으로 SEO 최적화** → **Google 검색 노출 확인**
    - sitemap.ts, robots.txt 생성 및 Search Console 제출로 색인률 개선 추적
    - **Lighthouse 성능 분석 결과: Performance 98점 / SEO 100점 / Best Practices 100점**
- **Google Analytics 4 연동**
    - 상품 클릭, 장바구니 추가, 결제 완료 등의 이벤트 추적을 구현
    - 관리자 대시보드에서 해당 데이터를 시각화
    - 이를 통해 사용자 행동 기반 마케팅 전략 수립 가능
--- 

## 주요 기능 요약
**1️⃣ 사용자 페이지 (User Features)**

- 회원가입 및 로그인 (JWT 기반 인증)
- 상품 목록, 상세, 필터 및 정렬 기능
- 장바구니 & 주문 기능
- 결제 시스템 연동
- 사용자 리뷰 작성 기능

**2️⃣ 관리자 페이지 (Admin Features)**

- 상품 관리 (등록, 수정, 삭제)
- 카테고리 관리 (트리 구조로 구성)
- 주문 상태 관리
- Google Analytics 기반 통계 대시보드
---
## 기술 스택
- Frontend: Next.js, TypeScript, Tailwind, Zustand, TanStack Query, Jest, Cypress, React Testing Library
- Backend: Springboot, JPA, MariaDB, AWS S3
- Infra & DevOps: EC2, Docker, Github Actions CI/CD
---

## 프로젝트 구조

```
next-ecommerce/
├─ client/ # Frontend (Next.js)
│ └─ src/
│ ├─ app/ # App Router (pages, layouts, server components)
│ ├─ components/ # 공용 UI 컴포넌트
│ ├─ apis/ # API 호출 모듈
│ ├─ store/ # Zustand 전역 상태 관리
│ ├─ hooks/ # Custom hooks
│ ├─ libs/ # 라이브러리 초기화 (axios, tanstack-query 등)
│ ├─ constants/ # 상수 값
│ ├─ utils/ # 유틸리티 함수
│ ├─ types/ # 전역 타입 정의
│ └─ middleware.ts # Next.js Middleware (인증/로깅 등)
│
├─ back/ # Backend (Spring Boot)
│ ├─ src/main/java/... # Controller, Service, Repository, Security
│ └─ build.gradle # Gradle 빌드 설정
│
├─ Jenkinsfile # CI/CD 파이프라인 정의
└─ README.md
```


---


## 설치 및 실행 순서

#### Frontend
```bash
cd client
npm install
npm run dev
```

#### Backend
```bash
cd back
./gradlew bootRun

```

