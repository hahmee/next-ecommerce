import { NextRequest, NextResponse } from 'next/server';

//src/app/api/test/route.ts
export async function GET(req: NextRequest) {
  console.log('?????? test API hit');
  return NextResponse.json({ test: true });
}