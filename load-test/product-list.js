// k6 load test: GET /api/public/products/list
//
// Scenario assumption:
//   - 중소 D2C 브랜드 쇼핑몰, 신상품 드롭 시점의 트래픽 스파이크
//   - 목표: 동시 접속 VU 100명 기준 서버가 몇 TPS까지 버티는지 + p95 응답시간
//   - 서버 스펙 가정: AWS EC2 t3.small (2 vCPU, 2GB RAM) 단일 인스턴스 (앱 + MariaDB 동거)
//
// Stages
//   1) ramp-up  30s: 0 → 50 VU
//   2) steady  1m:  50 VU 유지
//   3) peak    30s: 50 → 100 VU
//   4) hold    1m:  100 VU 유지 (신상품 드롭 피크)
//   5) ramp-down 30s: 100 → 0
//
// Thresholds (실패 기준):
//   - http_req_failed < 1%
//   - http_req_duration p(95) < 1500ms (이 정도면 실서비스 가능 수준)

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const latencyList = new Trend('list_latency', true);
const errorRate = new Rate('list_errors');

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m',  target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m',  target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
    list_latency: ['p(95)<1500'],
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  // Realistic user behavior: 페이지네이션 랜덤 + 카테고리 필터 간헐적
  const page = Math.floor(Math.random() * 3) + 1;          // 1~3 page
  const size = 10;
  const useCategory = Math.random() < 0.3;                 // 30% 확률로 카테고리 필터
  const categoryId = Math.floor(Math.random() * 10) + 1;   // cno 1~10

  let url = `${BASE}/api/public/products/list?page=${page}&size=${size}`;
  if (useCategory) url += `&categoryId=${categoryId}`;

  const res = http.get(url, {
    tags: { endpoint: 'products_list' },
  });

  latencyList.add(res.timings.duration);
  const ok = check(res, {
    'status 200': (r) => r.status === 200,
    'has data': (r) => r.body && r.body.length > 50,
  });
  errorRate.add(!ok);

  // 페이지 탐색 사이의 사용자 간격 (think time)
  sleep(Math.random() * 1.5 + 0.5);  // 0.5~2s
}
