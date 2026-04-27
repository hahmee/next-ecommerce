// Stress test: think time 제거 + VU 단계적 증가로 서버 saturation 포인트 측정
import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const latency = new Trend('list_latency', true);

export const options = {
  stages: [
    { duration: '20s', target: 50 },
    { duration: '30s', target: 50 },
    { duration: '20s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '20s', target: 200 },
    { duration: '40s', target: 200 },
    { duration: '20s', target: 0 },
  ],
};

const BASE = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  const page = Math.floor(Math.random() * 3) + 1;
  const res = http.get(`${BASE}/api/public/products/list?page=${page}&size=10`);
  latency.add(res.timings.duration);
  check(res, { 'status 200': (r) => r.status === 200 });
}
