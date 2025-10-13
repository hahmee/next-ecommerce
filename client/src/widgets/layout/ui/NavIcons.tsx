'use client';

import { useNavIcons } from '@/features/common/model/useNavIcons';
import { NavIconsView } from '@/widgets/layout/ui/NavIconsView';

export default function NavIcons() {
  const props = useNavIcons();
  return <NavIconsView {...props} />;
}
