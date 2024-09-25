"use server";

import {cookies} from "next/headers";

const host = process.env.NEXT_PUBLIC_BASE_URL;
interface IRequestInit {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: BodyInit | null
    credentials?: RequestCredentials
    cache?: RequestCache
    next?: NextFetchRequestConfig | undefined
    headers?: HeadersInit
}

export const fetchWithAuth2 = async (url: string, requestInit: IRequestInit) => {

    //쿠키 가져오기
    const authResponse = await fetch(`${process.env.AUTH_URL}/api/auth`, {
        method: "GET",
        headers: {Cookie: cookies().toString()},  //필수 이걸 넣어야지 route에서 쿠키 값 인식
    });

    const cookieJson = await authResponse.json();
    const memberCookie = cookieJson.member;

    // const test = getCookie("member"); //undefined

    // console.log('...뭘까?!!',test)

    if (!memberCookie) {
        return Promise.reject({ message: 'No member cookie found' });
    }
    // console.log('memberCookie', memberCookie);

    // const {accessToken, refreshToken, email} = JSON.parse(memberCookie);
    const {accessToken, refreshToken, email} = memberCookie;

    // const getReject = async (errorMessage: string) => {
    //     return Promise.reject({message: errorMessage}); //전달된 에러와 함께 프로미스를 거부합니다.
    // }

    const getConfigData = async (requestInit: IRequestInit) => {

        const {headers} = requestInit;

        //쿠키에 유저 정보 있는지 확인
        if (!accessToken || !refreshToken) {
            // console.log('Member NOT FOUND');
            //로그인 창으로 보내버리기. 로그인해주세요.
            return Promise.reject({response: {data: {error: 'REQUIRE_LOGIN'}}}); //전달된 에러와 함께 프로미스를 거부합니다.
        }

        return {
            ...requestInit,
            headers: {...headers, Authorization: `Bearer ${accessToken}`},
        };

    }

    const refreshJWT = async () => {
        const authorization = {Authorization: `Bearer ${accessToken}`};

        const response = await fetch(`${host}/api/member/refresh?refreshToken=${refreshToken}`, {
            method: "POST",
            headers: {
                ...authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email}),
        });

        //추가
        if (!response.ok) {
            throw new Error('JWT 갱신 실패');
        }

        const newJWT = await response.json();
        // console.log("New JWT created: ", newJWT);

        //새로 발급한 토큰 쿠키에 넣기
        // Error - Cookies can only be modified in a Server Action or Route Handler.
        // await setCookie('member', JSON.stringify(newCookie), 1);

        /*해결법- api route에서 set Cookie 한다.*/
        await fetch(`${process.env.AUTH_URL}/api/auth`, {
            method: "POST",
            body: JSON.stringify({accessToken: newJWT.accessToken, refreshToken: newJWT.refreshToken}),
            headers: { Cookie: cookies().toString() },  //필수 이걸 넣어야지 route에서 쿠키 값 인식
        });


        return newJWT;
    };

    try {

        const configData = await getConfigData(requestInit);

        const response = await fetch(`${host}${url}`, configData);

        const data = await response.json();

        if (response.ok && response.status === 200) {
            // jwt 토큰 문제
            //요청 api가 ERROR_ACCESS_TOKEN을 리턴할 때
            if (data && data.error === 'ERROR_ACCESS_TOKEN' && memberCookie) {
                //다시 발급
                const newJWT = await refreshJWT();

                const newConfigData = {
                    ...configData,
                    headers: {...configData.headers, Authorization: `Bearer ${newJWT.accessToken}`}
                };

                // 다시 요청하기 -> 백엔드에서 에러가 날 수 있다.
                const reResponse = await fetch(`${host}${url}`, newConfigData);

                const reData = await reResponse.json();
                console.log('reData:', reData);


                if (!reResponse.ok) {
                    // console.log('.....?', reData.message);
                    // console.log('!reResponse.ok')
                    // return Promise.reject({ message: reData.message });
                    // const reData = { message: "에러 메시지" };
                    // const errorMessage = reData?.message || 'Unknown error occurred';
                    // return Promise.reject({ message: errorMessage });

                    // return Promise.reject(new Error(errorMessage));

                    // return Promise.reject(new Error(errorMessage));
                    // throw new Error(errorMessage);
                    // return Promise.reject(new Error(reData.message));
                    // return Promise.reject(new Error(reData.message)); // 에러 처리
                }
                return reData;
            }
            return data;
        }else {
            console.log('??message....');
            return Promise.reject({ message: data.message });
        }

    }
    catch (error) {

        console.log('error---입니다...', error);
        const message = (error as Error | any).message;
        console.log('meesage....입니다..', message);
        throw error;//해당 에러는 fetchWithAuth를 호출한 곳으로 전달

    }


};

