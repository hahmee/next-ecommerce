// app/test/page.tsx
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default function TestPage() {
  const cookieStore = cookies();

  const token = cookies().get("access_token")?.value;
  console.log("🚀 SSR에서 access_token:", cookieStore);

  return <div>SSR 테스트 - {token ? "토큰 있음" : "토큰 없음"}</div>;
}
