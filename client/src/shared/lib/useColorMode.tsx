// src/shared/lib/useColorMode.tsx

﻿// src/shared/lib/useColorMode.tsx



import { useEffect } from 'react';

import useLocalStorage from '@/shared/lib/useLocalStorage';

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    colorMode === 'dark' ? bodyClass.add(className) : bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
