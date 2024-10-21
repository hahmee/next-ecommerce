import Script from 'next/script';
import React from "react";

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
    return (
        <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></Script>
            <Script id="google-analytics">
                {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}');
                        `
                }
            </Script>
        </>
    );
}