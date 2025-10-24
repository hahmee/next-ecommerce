'use client';

import { useNavIcons } from '@/widgets/layout';
import { NavIconsView } from '@/widgets/layout';

export function NavIcons() {
  const props = useNavIcons();
  return <NavIconsView {...props} />;
}
