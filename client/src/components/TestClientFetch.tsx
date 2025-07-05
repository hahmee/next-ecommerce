// components/TestClientFetch.tsx
"use client";
import { useEffect } from "react";
import { fetcher } from "@/utils/fetcher/fetcher";

export default function TestClientFetch() {
  useEffect(() => {
    fetcher("/api/test")
      .then(() => console.log("✅ fetcher 성공"))
      .catch(console.error);
  }, []);

  return <div>CSR 테스트 중...</div>;
}
