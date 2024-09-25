"use server";

import { cookies } from "next/headers";

const host = process.env.NEXT_PUBLIC_BASE_URL;

interface IRequestInit {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: BodyInit | null;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    next?: NextFetchRequestConfig | undefined;
    headers?: HeadersInit;
}

export const fetchWithAuth = async (url: string, requestInit: IRequestInit) => {
    try {
        // 쿠키 가져오기
        const authResponse = await fetch(`${process.env.AUTH_URL}/api/auth`, {
            method: "GET",
            headers: { Cookie: cookies().toString() },
        });

        const cookieJson = await authResponse.json();
        const memberCookie = cookieJson.member;

        if (!memberCookie) {
            return Promise.reject({ message: 'No member cookie found' });
        }

        const { accessToken, refreshToken, email } = memberCookie;

        const configData = await getConfigData(requestInit, accessToken, refreshToken);

        const response = await fetch(`${host}${url}`, configData);
        const data = await response.json();

        if (response.ok) {
            if (data?.error === 'ERROR_ACCESS_TOKEN') {
                const newJWT = await refreshJWT(accessToken, refreshToken, email);
                const newConfigData = {
                    ...configData,
                    headers: { ...configData.headers, Authorization: `Bearer ${newJWT.accessToken}` },
                };
                const reResponse = await fetch(`${host}${url}`, newConfigData);
                const reData = await reResponse.json();

                if (!reResponse.ok) {
                    // console.log('!esrers입니다...', reResponse);

                    console.log('reData.message', reData.message);
                    // return Promise.reject(new Error(reData.message));
                    return Promise.reject({ message: reData.message || 'Unknown error occurred' });
                }
                return reData;
            }
            return data;
        } else {
            console.log('????킄');
            // 백엔드에서 반환된 에러 처리
            return Promise.reject({ message: data?.message || 'Unknown error occurred' });
        }
    } catch (error) {
        console.error('Error in fetchWithAuth:', error);
        return Promise.reject({ message: (error as Error).message || 'Unexpected error occurred' });
    }
};

const getConfigData = async (requestInit: IRequestInit, accessToken: string, refreshToken: string) => {
    const { headers } = requestInit;

    if (!accessToken || !refreshToken) {
        return Promise.reject({ response: { data: { error: 'REQUIRE_LOGIN' } } });
    }

    return {
        ...requestInit,
        headers: { ...headers, Authorization: `Bearer ${accessToken}` },
    };
};

const refreshJWT = async (accessToken: string, refreshToken: string, email: string) => {
    const response = await fetch(`${host}/api/member/refresh?refreshToken=${refreshToken}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('JWT 갱신 실패');
    }

    const newJWT = await response.json();

    await fetch(`${process.env.AUTH_URL}/api/auth`, {
        method: "POST",
        body: JSON.stringify({ accessToken: newJWT.accessToken, refreshToken: newJWT.refreshToken }),
        headers: { Cookie: cookies().toString() },
    });

    return newJWT;
};
