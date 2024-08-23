"use server";

import {getCookie} from "@/utils/cookieUtil";
import {setCookie} from "@/utils/setCookieUtil";

const host = process.env.NEXT_PUBLIC_BASE_URL;

interface IRequestInit {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: BodyInit | null
    credentials?: RequestCredentials
    cache?: RequestCache
    next?: NextFetchRequestConfig | undefined
    headers?: HeadersInit
}

export const nextFetch = async (url: string, requestInit: IRequestInit) => {

    const memberCookie = getCookie('member');
    const accessToken = await memberCookie?.accessToken;
    const refreshToken = memberCookie?.refreshToken;


    const getConfigData = async (requestInit: IRequestInit) => {

        const {headers} = requestInit;

        console.log('memberCookie', memberCookie);
        //쿠키에 유저 정보 있는지 확인
        if (!memberCookie || !accessToken || !refreshToken) {
            console.log('Member NOT FOUND');
            //로그인 창으로 보내버리기. 로그인해주세요.
            return Promise.reject({response: {data: {error: 'REQUIRE_LOGIN'}}}); //전달된 에러와 함께 프로미스를 거부합니다.
        }

        const config = {
            ...requestInit,
            headers: {...headers, Authorization: `Bearer ${accessToken}`},
        }

        return config;
    }

    const refreshJWT = async () => {
        const authorization = {Authorization: `Bearer ${accessToken}`};
        const email = memberCookie?.email;

        const response = await fetch(`${host}/api/member/refresh?refreshToken=${refreshToken}`, {
            method: "POST", //GET?
            headers: {
                ...authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            }),
        });

        console.log('NEWJWT response입니다...', response.status);

        const newJWT = await response.json();

        return newJWT;
    };

    try {

        console.log('원래 jwt..accessToken: ', accessToken);
        console.log('원래 jwt..refreshToken: ', refreshToken);

        const configData = await getConfigData(requestInit);

        console.log('원래의 Token으로 만든 configData입니다.', configData);

        const response = await fetch(`${host}${url}`, configData);

        if (response.status === 200) {
            const data = await response.json();
            // jwt 토큰 문제
            if (data && data.error === 'ERROR_ACCESS_TOKEN' && memberCookie) {
                //다시 발급
                const newJWT = await refreshJWT();

                if (newJWT.accessToken === accessToken) {

                    console.log('이거 나오면 안 돼 ');
                }


                const newCookie = {...memberCookie, accessToken: newJWT.accessToken, refreshToken: newJWT.refreshToken};


                console.log('HERE IS NEW JWT TOKEN', newJWT);

                //새로 발급한 토큰 쿠키에 넣기
                await setCookie('member', JSON.stringify(newCookie), 1);

                console.log('그럼 새로 온 쿠키는?', getCookie('member'));

                const newConfigData = {...configData, headers: {...configData.headers, Authorization: `Bearer ${newJWT.accessToken}`}};
                // 다시 요청하기
                const reResponse = await fetch(`${host}${url}`, newConfigData);

                const reData = await reResponse.json();

                console.log('reData', reData);

                return reData;

            }
            return data;
        }

        // if (response.status === 401) { // jwt 토큰 문제
        //     const newJWT = await refreshJWT();
        //     const reResponse = '';
        // }
    }
    catch (error) {
        console.log('최종에러....', error);
    }

}

