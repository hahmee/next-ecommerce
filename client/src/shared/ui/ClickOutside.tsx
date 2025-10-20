// src/shared/ui/ClickOutside.tsx

import React, { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  exceptionRef?: React.RefObject<HTMLElement>;
  onClick: () => void;
  className?: string;
}

const ClickOutside: React.FC<Props> = ({ children, exceptionRef, onClick, className }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      const target = event.target as Node;

      // wrapperRef, exceptionRef, portal-root 체크
      const isClickedInside =
        (wrapperRef.current && wrapperRef.current.contains(target)) ||
        (exceptionRef?.current &&
          (exceptionRef.current === target || exceptionRef.current.contains(target))) ||
        document.getElementById('portal-root')?.contains(target);

      if (!isClickedInside) {
        onClick();
      }
    };

    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div ref={wrapperRef} className={`${className || ''}`}>
      {children}
    </div>
  );
};

export default ClickOutside;
