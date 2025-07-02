'use client';

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function NavbarToastHandler({ message }: { message?: string }) {
  const hasShown = useRef(false);

  useEffect(() => {
    if (message && !hasShown.current) {
      toast.error(message);
      hasShown.current = true;
    }
  }, [message]);

  return null;
}
