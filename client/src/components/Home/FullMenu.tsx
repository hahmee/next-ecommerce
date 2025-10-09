'use client';

import { useFullMenu } from '@/hooks/useFullMenu';
import { FullMenuView } from './FullMenuView';

export default function FullMenu() {
  const { categories } = useFullMenu();
  return <FullMenuView categories={categories} />;
}
