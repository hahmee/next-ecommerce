'use client';

import { useFullMenu } from '@/widgets/layout/model/useFullMenu';
import { FullMenuView } from '@/widgets/layout/ui/FullMenuView';

export function FullMenu() {
  const { categories } = useFullMenu();
  return <FullMenuView categories={categories} />;
}
