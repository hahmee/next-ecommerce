// src/libs/services/utils/buildSearchParams.ts

export type QueryPrimitive = string | number | boolean | Date | null | undefined;
export type QueryValue = QueryPrimitive | QueryPrimitive[];

/**
 * 객체를 URLSearchParams로 변환
 * - undefined/null은 건너뜀
 * - 배열은 동일 key로 여러 번 append
 * - Date는 ISO 문자열(YYYY-MM-DDTHH:mm:ss.sssZ)로 변환
 *
 * 사용:
 * const qs = buildSearchParams({ page: 1, q: 'hello', tags: ['a','b'], bool: false });
 * fetch(`/api/foo?${qs.toString()}`)
 */
export function buildSearchParams<T extends Record<string, QueryValue>>(
  params: T,
): URLSearchParams {
  const qs = new URLSearchParams();

  const toStringVal = (v: QueryPrimitive) => {
    if (v == null) return undefined;
    if (v instanceof Date) return v.toISOString();
    return String(v);
  };

  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      for (const v of value) {
        const s = toStringVal(v);
        if (s !== undefined) qs.append(key, s);
      }
    } else {
      const s = toStringVal(value);
      if (s !== undefined) qs.append(key, s);
    }
  }

  return qs;
}

export default buildSearchParams;
