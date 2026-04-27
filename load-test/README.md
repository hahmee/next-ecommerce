# Load Test — Next-Ecommerce

## Service Assumption
- **Domain**: 중소 D2C 브랜드 쇼핑몰
- **Target DAU**: 1,000명 (초기 런칭 3개월차 규모)
- **Peak scenario**: 신상품 드롭 10분 — 평상시 대비 트래픽 10~20배 스파이크
- **Target peak throughput**: 100 TPS

## Test Environment
- **Location**: 로컬 개발 환경 (WSL2 Ubuntu 24.04)
- **Stack**: Spring Boot 3.1.4 (Gradle bootRun) + MariaDB (Docker)
- **HikariCP pool**: 10 (Spring Boot 기본값)
- **Purpose**: **코드 레벨 구조적 병목(N+1 등) 발견 목적**. 하드웨어 성능이 실 서버와 다르므로 절대 TPS 수치는 참고값이며, **개선 비율(%)**이 환경 무관 유효 지표.
- **Next step (실 배포 시)**: 프로덕션과 동일 스펙의 스테이징 환경에서 재측정 필요.

## Tooling
- **k6** v0.54.0 (Grafana)
- Scripts:
  - `product-list.js` — 현실 사용자 패턴 (think time 0.5~2s, 50/100 VU stage)
  - `product-list-stress.js` — think time 제거, 50→100→200 VU 단계 증가 stress

## Results

### Baseline (before fix)

```
k6 run product-list-stress.js
```

| 지표 | 값 |
|---|---|
| 총 요청 | 18,396 |
| TPS | **102.5** |
| p50 | 955ms |
| p95 | **2.33s** |
| p90 | 2.10s |
| max | 7.55s |
| 실패율 | 0% |

VU 200 구간에서 응답시간이 지수적으로 증가 → 서버 **포화(saturation) 진입**.

### Bottleneck

`ProductServiceImpl.getList()`에서 `Product` 엔티티의 다음 연관관계가 Lazy 로딩이라 페이지당 30+ 쿼리 발생:

```java
@ElementCollection(fetch = FetchType.LAZY)   // sizeList  → N+1
private List<String> sizeList;

@OneToMany(fetch = FetchType.LAZY)            // colorList → N+1
private List<ColorTag> colorList;
```

메인 쿼리(`selectList`)가 `left join`은 포함하나 **fetch join이 아니어서** 엔티티 조회 후 컬렉션 접근 시 개별 쿼리가 추가 발생.

### Fix

`application.properties`에 한 줄 추가:

```properties
spring.jpa.properties.hibernate.default_batch_fetch_size=100
```

Hibernate가 Lazy 컬렉션 접근 시 `IN` 절로 묶어 일괄 조회 → 페이지당 쿼리가 **30+ → 3~4개**로 감소.
`fetch join` + pagination의 `MultipleBagFetchException` 위험 없이 안전하게 N+1 해소.

### Improved (after fix)

| 지표 | Baseline | **Improved** | 개선율 |
|---|---|---|---|
| 총 요청 | 18,396 | **24,282** | +32% |
| **TPS** | 102.5 | **135.4** | **+32%** |
| **p50** | 955ms | **652ms** | **-32%** |
| **p95** | 2.33s | **1.84s** | **-21%** |
| 실패율 | 0% | 0% | — |

## How to reproduce

```bash
# 1. DB 기동
docker compose up -d db

# 2. 백엔드 기동
cd back
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/credentials/credentials.json
./gradlew bootRun

# 3. (다른 터미널) k6 실행
k6 run load-test/product-list-stress.js
```

## Raw output
- `results/baseline-stress.log` — before fix
- `results/improved-stress.log` — after fix
- `results/*.json` — k6 summary export
