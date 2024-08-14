import {getCookie, setCookie} from "@/utils/cookieUtil";

const host = process.env.NEXT_PUBLIC_BASE_URL;

interface IRequestInit {
    // url: string
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: BodyInit | null
    credentials?: RequestCredentials
    cache?: RequestCache
    next?: NextFetchRequestConfig | undefined
    headers?: HeadersInit
}

//newAccessToken과 newRefreshToken 새로 발급
const refreshJWT = async (accessToken: string, refreshToken: string) => {
    const header = {Authorization: `Bearer ${accessToken}`};

    const res = await fetch(`${host}/api/member/refresh?refreshToken=${refreshToken}`, {
        method: 'GET',
        headers: header,
    });

    console.log('뭐지?---------------');
    console.log(res);

    return res.json();
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
    // const response = await fetch(url, config);
    //
    // if (!response.ok) {
    //     // This will activate the closest `error.js` Error Boundary
    //     throw new Error('Failed to fetch data');
    // }

}


//before return response 응답을 받기 전 실행된다.
const beforeRes = async (url:string, response: any) => { // await fetch(`${host}/${url}`, others);
    const data = await response.json();

    if (data && data.error === 'ERROR_ACCESS_TOKEN') { //에러가 나면
        const memberCookieValue = getCookie('member');

        //토큰이 없다면
        if (!memberCookieValue.accessToken || !memberCookieValue.refreshToken) {
            return Promise.reject(); //거절
        }

        //accessToken 과 refreshToken 둘 다 있으면
        const result = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken); //새로 갱신
        console.log('refreshJWT RESULT', result);

        memberCookieValue.accessToken = result.accessToken;
        memberCookieValue.refreshToken = result.refreshToken;

        setCookie('member', JSON.stringify(memberCookieValue), 1);//새로 발급한 토큰 쿠키에 넣기

        //원래의 호출
        const originalRequest = response.config;

        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

        // headers: {Authorization: `Bearer ${accessToken}`}

        const fetchData = await fetch(url, originalRequest); //다시 정상 응답진행

        const data = await fetchData.json();

        return data;

    }
    //토큰이 다 괜찮으면
    return data;
};

export const fetchWithInterceptor = async (url: string, requestInit: IRequestInit) => {
    try {

        const configData = await beforeReq(requestInit); //헤더
        console.log('configData', configData);

        const response = await fetch(`${host}${url}`, configData);

        const resultJson = await beforeRes(`${host}${url}`, response);

        // console.log('최종', result);
        return resultJson;

    }catch(err) {
        console.log('?errr??????????', err);
    }

};
