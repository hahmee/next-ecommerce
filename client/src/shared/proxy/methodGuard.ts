import { NextResponse } from 'next/server';

import { ALLOWED_METHODS } from '@/shared/proxy/constants';

/*API 라우트에 들어온 요청의 HTTP 메서드가 허용된 집합에 포함되어 있는지 검사한다.*/
export function guardHttpMethod(req: Request) {
  if (!ALLOWED_METHODS.has(req.method as any)) {
    return NextResponse.json(
      {
        success: false,
        code: 405,
        message: 'Method Not Allowed',
      },
      { status: 405 },
    );
  }
  return null;
}
