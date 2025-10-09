'use client';

import  { useNavIcons } from '@/hooks/useNavIcons';
import { NavIconsView } from './NavIconsView';

export default function NavIcons() {
  const props = useNavIcons();
  return <NavIconsView {...props} />;
}
