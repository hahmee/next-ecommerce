"use server";

import {getCookie} from "@/utils/getCookieUtil";
import {setCookie} from "@/utils/setCookieUtil";

const host = process.env.NEXT_PUBLIC_BASE_URL;

interface IRequestInit {
    // url: string
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: BodyInit | null
    credentials?: RequestCredentials
    cache?: RequestCache
    next?: NextFetchRequestConfig | undefined
    headers?: HeadersInit
}

//newAccessToken과 newRefreshToken 새로 발급
const refreshJWT = async (accessToken: string, refreshToken: string) => {

    const header = {Authorization: `Bearer ${accessToken}`};

    const response = await fetch(`${host}/api/member/refresh?refreshToken=${refreshToken}`, {
        method: 'GET',
        headers: header,
    });

    console.log('response입니다...', response.status);

    const data = await response.json();
    console.log('왜 안나오지?', data);

    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to refreshJWT data');
    }

    return data;
};

//before request -> 헤더에 accessToken 설정
const beforeReq = async (requestInit: IRequestInit) => {
    const {headers} = requestInit;

    const memberInfo = getCookie('member');
    //쿠키에 유저 정보 있는지 확인
    if (!memberInfo) {
        console.log('Member NOT FOUND');
        return Promise.reject({response: {data: {error: 'REQUIRE_LOGIN'}}});
    }

    const { accessToken } = memberInfo;

    const config = {
        ...requestInit,
        headers: {...headers, Authorization: `Bearer ${accessToken}`},
    }

    return config;

}

//before return response 응답을 받기 전 실행된다.
const beforeRes = async (url:string, response: any) => {
    const data = await response.json();
    console.log('??? 데이터다', data);
    
    if (data && data.error === 'ERROR_ACCESS_TOKEN') { //ERROR_ACCESS_TOKEN 에러가 리턴되면
        const memberCookieValue = getCookie('member')!; //변수가 실제로 할당되었음

        //토큰이 없다면
        if (!memberCookieValue.accessToken || !memberCookieValue.refreshToken) {
            return Promise.reject(); //거절
        }

        //accessToken 과 refreshToken 둘 다 있으면
        const newJWT = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken); //새로 갱신

        memberCookieValue.accessToken = newJWT.accessToken;
        memberCookieValue.refreshToken = newJWT.refreshToken;

        console.log('HERE IS NEW JWT TOKEN', newJWT);

        //Cookies can only be modified in a Server Action or Route Handler
        await setCookie('member', JSON.stringify(memberCookieValue), 1);//새로 발급한 토큰 쿠키에 넣기

        //원래의 호출
        const originalRequest = response.config;

        originalRequest.headers.Authorization = `Bearer ${newJWT.accessToken}`;

        // headers: {Authorization: `Bearer ${accessToken}`}

        const fetchResponse = await fetch(url, originalRequest); //다시 정상 응답진행

        if (!fetchResponse.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data');
        }

        const returnData = await fetchResponse.json();

        return returnData;

    }
    //토큰이 다 괜찮으면
    return data;
};

export const nextFetch = async (url: string, requestInit: IRequestInit) => {
    try {

        const configData = await beforeReq(requestInit); //헤더

        const response = await fetch(`${host}${url}`, configData);

        // 백엔드에서 ERROR_ACCESS_TOKEN는 그냥 에러가 아니라 Map 데이터 200으로 주었다.
        //따라서 토큰 제외하고 에러있을 때는 걸리지만, 토큰은 여기에 안 걸림
        if (!response.ok) {
            console.log('status', response.status);
            console.log('??????????????Zzzz');
            // This will activate the closest `error.js` Error Boundary
            // throw new Error('Failed to fetch data');
        }
        
        const resultJson = await beforeRes(`${host}${url}`, response);

        return resultJson;

    } catch(error) {
        console.log('????????이거 에러', error)
        return { error: new Error(`Error: ${error}`) };
    }

};
