"use client";
import React, { useEffect, useState } from "react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import crypto from "crypto";
import {getCookie} from "cookies-next";

const GA_TRACKING_ID = process.env.GOOGLE_GA_TRACKING_ID;
const GTM_TRACKING_ID = process.env.GOOGLE_GTM_TRACKING_ID;

// User-ID 암호화 함수
function hashUserId(userId:string):string {
    return crypto.createHash("sha256").update(userId).digest("hex");
}

const UserGA = () => {
    const memberInfo = getCookie('member');
    const member = memberInfo ? JSON.parse(memberInfo) : null;
    const [hashedUserId, setHashedUserId] = useState("");

    useEffect(() => {
        if(member) {
            console.log('member', member.email);
            const email = member.email;

            const encryptedId = hashUserId(email);
            console.log('encryptedId', encryptedId);
            setHashedUserId(encryptedId);
        }
    }, [member]);

    if (!hashedUserId || !GTM_TRACKING_ID || !GA_TRACKING_ID) return null;

    return (
        <>
            <GoogleTagManager gtmId={GTM_TRACKING_ID} dataLayer={{ user_id: hashedUserId }} />

            {/*<GoogleTagManager gtmId={GTM_TRACKING_ID} dataLayer={{ user_id: hashedUserId, seller_id:"asdf" }} />*/}
            <GoogleAnalytics gaId={GA_TRACKING_ID} />
        </>
    );
};

export default UserGA;