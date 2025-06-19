"use client";

import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";
import {GA_CTA_EVENT} from "@/constants";
import React from "react";

type GACtaProps = {
  eventLabel: GA_CTA_EVENT;
  children: React.ReactElement;
};

//커스텀 이벤트를 GA4와 GTM으로 전송
export default function GACta({ eventLabel, children }: GACtaProps) {
  function handleClick(e: React.MouseEvent) {

    console.log("GA 이벤트 전송됨:", eventLabel);

    sendGAEvent("event", eventLabel); // GA4에 이벤트 전송
    sendGTMEvent("event", eventLabel);// GTM에도 동일 이벤트 전송
    children.props.onClick?.(e);// 원래 자식 요소가 갖고 있던 onClick도 실행해줌
  }

  return React.cloneElement(children, { // children 복제 + onClick을 handleClick으로 오버라이딩
    onClick: handleClick,
  });
}
