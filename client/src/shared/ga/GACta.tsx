// src/shared/ga/GACta.tsx

'use client';

import { sendGAEvent } from '@next/third-parties/google';
import React from 'react';

type GACtaProps = {
  eventName?: string; // 기본값은 "click_cta"
  eventParams?: Record<string, any>; // item_id, value 등 추가 파라미터
  // eventLabel: GA_CTA_EVENT;
  children: React.ReactElement;
};

// 커스텀 이벤트를 GA4와 GTM으로 전송
export default function GACta({ eventName = 'click_cta', eventParams = {}, children }: GACtaProps) {
  function handleClick(e: React.MouseEvent) {
    console.log('GA 이벤트 전송됨:', eventName, eventParams);
    sendGAEvent('event', eventName, eventParams); // GA4에 이벤트 전송
    children.props.onClick?.(e); // 원래 자식 요소가 갖고 있던 onClick도 실행해줌
  }

  return React.cloneElement(children, {
    // children 복제 + onClick을 handleClick으로 오버라이딩
    onClick: handleClick,
  });
}
