'use client';

import { useFullMenu } from '@/widgets/layout/model/useFullMenu';
import { FullMenuView } from '@/widgets/layout/ui/FullMenuView';

export default function FullMenu() {
  const { categories } = useFullMenu();
  return <FullMenuView categories={categories} />;
}
