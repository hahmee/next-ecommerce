"use client";

import {useInView} from "react-intersection-observer";
import React, {ReactNode} from "react";

interface LazyLoadWrapperProps {
    children: ReactNode;
    once?: boolean; // 여러 번 관찰할지 여부 (기본: true)
    className?: string;
    fallback?: ReactNode;
}

const LazyLoadWrapper = ({
                           children,
                           once = true,
                           className,
                           fallback = null,
                         }: LazyLoadWrapperProps) => {

  const {ref, inView} = useInView({ // ref: 감시하고 싶은 DOM 요소, inView: 화면에 10% 이상보이면 true
    triggerOnce: once,
    threshold: 0.1, // 요소가 10%만 보여도 inView 처리
  });

  return (
    <div ref={ref} className={`${className ?? ""}`}>
      {inView ? children : fallback}
    </div>
  );
};

export default LazyLoadWrapper;
