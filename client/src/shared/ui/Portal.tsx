// src/shared/ui/Portal.tsx

import React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  return ReactDOM.createPortal(children, document.getElementById('portal-root')!);
};

export default Portal;
