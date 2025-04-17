// utils/fetchJWT.ts

"use server";

import { Member } from "@/interface/Member";
import { getCookie, setCookie } from "@/utils/cookie";

const host = process.env.BACKEND_URL;

interface IRequestInit {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: BodyInit | null;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    next?: NextFetchRequestConfig | undefined;
    headers?: HeadersInit;
}

type FetchJWTResult =
    | { success: true; data: any }
    | { success: false; message: string };

export const fetchJWT = async (
    url: string,
    requestInit: IRequestInit
): Promise<FetchJWTResult> => {
    const member = (await getCookie("member")) as Member | undefined;

    if (!member || !member.accessToken || !member.refreshToken) {
        return { success: false, message: "로그인이 필요합니다." };
    }

    const { accessToken, refreshToken, email } = member;
    const configData = getConfigData(requestInit, accessToken);

    let response = await fetch(host + url, configData);
    let data = await response.json();

    if (response.ok) return { success: true, data };

    if (data.message === "ERROR_ACCESS_TOKEN") {
        const newJWT = await refreshJWT(accessToken, refreshToken, email, member);
        const newConfigData = getConfigData(configData, newJWT.accessToken);

        response = await fetch(host + url, newConfigData);
        data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "요청 실패" };
        }

        return { success: true, data };
    }

    return { success: false, message: data.message || "서버 오류" };
};

const getConfigData = (requestInit: IRequestInit, accessToken: string) => {
    const { headers } = requestInit;
    return {
        ...requestInit,
        headers: { ...headers, Authorization: `Bearer ${accessToken}` },
    };
};

const refreshJWT = async (
    accessToken: string,
    refreshToken: string,
    email: string,
    member: Member
) => {
    const response = await fetch(
        host + "/api/member/refresh?refreshToken=" + refreshToken,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        }
    );

    if (!response.ok) {
        throw new Error("JWT 갱신에 실패했습니다.");
    }

    const newJWT = await response.json();
    const newCookie = {
        ...member,
        accessToken: newJWT.accessToken,
        refreshToken: newJWT.refreshToken,
    } as Member;

    await setCookie("member", JSON.stringify(newCookie));
    return newJWT;
};
