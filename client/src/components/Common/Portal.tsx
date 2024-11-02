import React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
    return ReactDOM.createPortal(children, document.getElementById('portal-root')!);
};

export default Portal;


//const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const el = document.createElement('div');
//     document.body.appendChild(el);
//     return ReactDOM.createPortal(children, el);
// };
//
// export default Portal;


