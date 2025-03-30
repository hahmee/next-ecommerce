"use client";

import { useInView } from "react-intersection-observer";
import React, { ReactNode } from "react";

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
    const { ref, inView } = useInView({
        triggerOnce: once,
        threshold: 0.1,
    });

    return (
        <div ref={ref} className={`${className ?? ""} min-h-[400px]`}>
            {inView ? children : fallback}
        </div>
    );
};

export default LazyLoadWrapper;
