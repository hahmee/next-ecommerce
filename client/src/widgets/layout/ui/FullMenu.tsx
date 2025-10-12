'use client';

import { FullMenuView } from 'src/components/Home/Common/FullMenuView';

import { useFullMenu } from '@/hooks/common/useFullMenu';

export default function FullMenu() {
  const { categories } = useFullMenu();
  return <FullMenuView categories={categories} />;
}
