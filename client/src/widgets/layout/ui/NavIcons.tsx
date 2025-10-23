'use client';

import { useNavIcons } from '@/widgets/layout/model/useNavIcons';
import { NavIconsView } from '@/widgets/layout/ui/NavIconsView';

export function NavIcons() {
  const props = useNavIcons();
  return <NavIconsView {...props} />;
}
