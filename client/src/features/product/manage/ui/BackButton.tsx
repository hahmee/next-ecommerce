// src/features/product/manage/ui/BackButton.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex rounded items-center justify-center gap-2.5 border border-primary px-8 py-3 text-center font-medium text-primary hover:bg-opacity-90 lg:px-6 xl:px-8"
    >
      뒤로가기
    </button>
  );
}
