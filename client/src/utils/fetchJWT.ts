// utils/fetchJWT.ts

"use server";

import { Member } from "@/interface/Member";
import { DataResponse } from "@/interface/DataResponse";
import { getCookie, setCookie } from "@/utils/cookie";

const host = process.env.BACKEND_URL || "http://localhost";

interface IRequestInit {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: BodyInit | null;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    next?: NextFetchRequestConfig | undefined;
    headers?: HeadersInit;
}

// 둘 중에 하나 반환
export type FetchJWTResult<T = any> =
    | { success: true; data: T; message: string; code: number }
    | { success: false; message: string; code: number };

export const fetchJWT = async <T = any>(
    url: string,
    requestInit: IRequestInit
): Promise<FetchJWTResult<T>> => {
    const member = (await getCookie("member")) as Member | undefined;

    if (!member || !member.accessToken || !member.refreshToken) {
        return { success: false, message: "로그인이 필요합니다.", code: 401 };
    }

    const { accessToken, refreshToken, email } = member;
    const configData = getConfigData(requestInit, accessToken);

    let response = await fetch(host + url, configData);
    let raw: DataResponse<T> = await response.json();

    if (response.ok && raw.success) {
        return { success: true, data: raw.data, message: raw.message, code: response.status };
    }

    if (raw.message === "ERROR_ACCESS_TOKEN") {
        try {
            const newJWT = await refreshJWT(accessToken, refreshToken, email, member);
            const newConfigData = getConfigData(configData, newJWT.accessToken);

            response = await fetch(host + url, newConfigData);
            raw = await response.json();

            if (response.ok && raw.success) {
                return { success: true, data: raw.data, message: raw.message, code: response.status };
            }
            return { success: false, message: raw.message || "요청 실패", code: response.status };
        } catch (e) {
            return { success: false, message: "JWT 갱신 실패", code: 401 };
        }
    }

    return { success: false, message: raw.message || "서버 오류", code: response.status };
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
