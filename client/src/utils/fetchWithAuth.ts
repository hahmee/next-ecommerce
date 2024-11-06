"use server";

import {Member} from "@/interface/Member";
import {getCookie, setCookie} from "@/utils/cookie";

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

    // 쿠키 가져오기 (수정필요)
    // const authResponse = await fetch(`${process.env.AUTH_URL}/api/auth`, {
    //     method: "GET",
    //     headers: {Cookie: cookies().toString()},
    // });

    // const cookieJson = await authResponse.json();

    //쿠키 가져오기
    // const memberCookie = cookies().get('member') as Member | undefined;

    const member = await getCookie("member") as Member | undefined;
    // console.log('fetchWithAuth memberCookie', member);

    //쿠키 없음
    if (!member) {
        //다시 로그인 요망
        throw new Error("로그인이 필요합니다.");
    }

    const {accessToken, refreshToken, email} = member;

    if (!accessToken || !refreshToken) {
        //다시 로그인 요망
        throw new Error("로그인이 필요합니다.");
    }

    //configData만들기
    const configData = getConfigData(requestInit, accessToken);

    const response = await fetch(`${host}${url}`, configData);
    const data = await response.json();

    console.log('data...입니다..', data); //{ message: 'ERROR_ACCESS_TOKEN', code: 401, ERROR_ACCESS_TOKEN: true }
    console.log('response.status ', response.status); // 200
    //문제 없음
    if (response.ok) {
        return data;
    } else {
        //백엔드 오류
        //만약 refreshToken, AccessToken 만료돼서 서버에서 오류 떴다면,
        if (data.message === "ERROR_ACCESS_TOKEN") {

            //새로운 JWT 토큰
            const newJWT = await refreshJWT(accessToken, refreshToken, email, member);

            console.log('newJWT....!!newJWT!!', newJWT);

            const newConfigData = getConfigData(configData, newJWT.accessToken);

            //제대로 시도한다.
            const reResponse = await fetch(`${host}${url}`, newConfigData);
            const reData = await reResponse.json();

            if (!reResponse.ok) {
                // This will activate the closest `error.js` Error Boundary
                throw new Error(reData.message);
            } else {
                return reData;
            }
        }

        // This will activate the closest `error.js` Error Boundary
        console.error(data.message);
        throw new Error(data.message);
    }

};


const getConfigData = (requestInit: IRequestInit, accessToken: string) => {
    const {headers} = requestInit;

    //헤더 세팅
    return {
        ...requestInit,
        headers: {...headers, Authorization: `Bearer ${accessToken}`},
    };
};

//서버값: return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
const refreshJWT = async (accessToken: string, refreshToken: string, email: string, member:Member) => {
    const response = await fetch(`${host}/api/member/refresh?refreshToken=${refreshToken}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email}),
    });

    if (!response.ok) {
        throw new Error('JWT 갱신 실패했습니다. ');
    }

    const newJWT = await response.json();



    const newCookie = {...member, accessToken: newJWT.accessToken, refreshToken: newJWT.refreshToken} as Member;


    //새로 발급받은 jwt 을 쿠키에 다시 세팅한다.
    await setCookie("member", JSON.stringify(newCookie));


    // 쿠키 다시 세팅 (수정필요)
    // await fetch(`${process.env.AUTH_URL}/api/auth`, {
    //     method: "POST",
    //     body: JSON.stringify({ accessToken: newJWT.accessToken, refreshToken: newJWT.refreshToken }),
    //     headers: { Cookie: cookies().toString() },
    // });

    return newJWT;
};
