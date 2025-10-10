'use client';

import { NavIconsView } from 'src/components/Home/Common/NavIconsView';

import { useNavIcons } from '@/hooks/common/useNavIcons';

export default function NavIcons() {
  const props = useNavIcons();
  return <NavIconsView {...props} />;
}
