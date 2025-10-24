'use client';

import { useFullMenu } from '@/widgets/layout';
import { FullMenuView } from '@/widgets/layout';

export function FullMenu() {
  const { categories } = useFullMenu();
  return <FullMenuView categories={categories} />;
}
