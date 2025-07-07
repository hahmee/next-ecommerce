// import { NextRequest, NextResponse } from 'next/server';
// import {cookies} from "next/headers";
//
// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const startDate = searchParams.get('startDate');
//   const endDate = searchParams.get('endDate');
//   const comparedStartDate = searchParams.get('comparedStartDate');
//   const comparedEndDate = searchParams.get('comparedEndDate');
//   const filter = searchParams.get('filter');
//   const cookie = req.headers.get("cookie") ?? "";
//   console.log('[GET] 쿠키:', cookie); // access_token=xxx; refresh_token=yyy ..
//
//   const SPRING_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/real-time-top` +
//     `?startDate=${startDate}` +
//     `&endDate=${endDate}` +
//     `&comparedStartDate=${comparedStartDate}` +
//     `&comparedEndDate=${comparedEndDate}` +
//     `&filter=${filter}`;
//
//   const springRes = await fetch(SPRING_URL, {
//     method: 'GET',
//     headers: {
//       cookie,
//     },
//     credentials: 'include',
//   });
//
//   if (!springRes.ok) {
//     return NextResponse.json({ success: false, message: 'Spring API 오류' }, { status: springRes.status });
//   }
//
//   const json = await springRes.json();
//   console.log('json',json)
//   return NextResponse.json({ success: true, data: json });
// }
