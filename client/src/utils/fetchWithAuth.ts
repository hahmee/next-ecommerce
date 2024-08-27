"use server";

import {getCookie} from "@/utils/getCookieUtil";
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

export const fetchWithAuth = async (url: string, requestInit: IRequestInit) => {

    const memberCookie = getCookie('member');
    const accessToken = await memberCookie?.accessToken;
    const refreshToken = memberCookie?.refreshToken;


    const getReject = async (errorMessage: string) => {
        return Promise.reject({message: errorMessage}); //전달된 에러와 함께 프로미스를 거부합니다.
    }

    const getConfigData = async (requestInit: IRequestInit) => {

        const {headers} = requestInit;

        console.log('memberCookie', memberCookie);

        //쿠키에 유저 정보 있는지 확인
        if (!memberCookie || !accessToken || !refreshToken) {
            // console.log('Member NOT FOUND');
            //로그인 창으로 보내버리기. 로그인해주세요.
            return Promise.reject({response: {data: {error: 'REQUIRE_LOGIN'}}}); //전달된 에러와 함께 프로미스를 거부합니다.
        }

        console.log('requestInit입니다....', requestInit.body);

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

        // console.log('NEWJWT response입니다...', response.status);

        const newJWT = await response.json();

        return newJWT;
    };

    try {


        console.log('원래 jwt..accessToken: ', accessToken);
        console.log('원래 jwt..refreshToken: ', refreshToken);

        console.log('??requestInit', requestInit.body); // 두개씩 들어옴
        const configData = await getConfigData(requestInit);


        console.log('...configData입니다.', configData.body);

        // const response = await fetch(`${host}${url}`, configData);
        const response = await fetch(`${host}${url}`, configData);


        // console.log('response.status', response.status);

        const data = await response.json();

        if (response.ok && response.status === 200) {
            // jwt 토큰 문제
            //요청 api가 ERROR_ACCESS_TOKEN을 리턴할 때
            if (data && data.error === 'ERROR_ACCESS_TOKEN' && memberCookie) {
                //다시 발급
                const newJWT = await refreshJWT();

                const newCookie = {...memberCookie, accessToken: newJWT.accessToken, refreshToken: newJWT.refreshToken};

                // console.log('HERE IS NEW JWT TOKEN', newJWT);
                //새로 발급한 토큰 쿠키에 넣기
                // Error - Cookies can only be modified in a Server Action or Route Handler.
                await setCookie('member', JSON.stringify(newCookie), 1);
                //이걸 미들웨어에서하려면
                // 미들웨어에서 그럼 api 보낼때마다 확인해주기..?


                // console.log('그럼 새로 온 쿠키는?', getCookie('member'));

                const newConfigData = {
                    ...configData,
                    headers: {...configData.headers, Authorization: `Bearer ${newJWT.accessToken}`}
                };

                // 다시 요청하기 -> 백엔드에서 에러가 날 수 있다.
                const reResponse = await fetch(`${host}${url}`, newConfigData);

                const reData = await reResponse.json();

                if (!reResponse.ok) {
                    // console.log('!reResponse.ok')
                    await getReject(reData.message);
                    // return new Error(data.message);

                }

                // console.log('reData', reData);

                return reData;


            }

            return data;
        }

        if (!response.ok) {

            await getReject(data.message);
            // return { error: new Error(`Error: ${data.message}`) };

        }
    }
    catch (error) {

        // console.log('error---', error);
        const message = (error as Error | any).message;
        // console.log('meesage....', message);
        // return new Error(message);
        throw error;
        // return { message: "No credentials provided", statusCode: 401 };
    }


};

