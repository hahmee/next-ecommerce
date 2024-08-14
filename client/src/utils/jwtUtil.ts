

import {getCookie, setCookie} from './cookieUtil';

//accessToken & Refresh Token
//Access Token의 만료 후, Refresh Token을 활용하여 자동으로 새로운 Access Token을 갱신하는 방식
// const jwtAxios: AxiosInstance = axios.create();

const refreshJWT = async (accessToken: string, refreshToken: string) => {
    const host = "http://localhost:8080";


    const header = {headers: {Authorization: `Bearer ${accessToken}`}};

    const res = await axios.get(`${host}/api/member/refresh?refreshToken=${refreshToken}`, header);

    console.log('뭐지?---------------');
    console.log(res.data); //newAccessToken과 newRefreshToken

    return res.data;
};

//before request -> 헤더에 accessToken 보냄
const beforeReq = (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> | Promise<any> => {
  console.log('before request.............', getCookie('member'));

  const memberInfo = getCookie('member');

  if (!memberInfo) {
    console.log('Member NOT FOUND');
    return Promise.reject({ response: { data: { error: 'REQUIRE_LOGIN' } } });
  }

  const { accessToken } = memberInfo;

  console.log('accessToken이다..', accessToken);

  // Authorization 헤더 처리
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

//fail request
const requestFail = (err: AxiosError | Error): Promise<AxiosError> => {
  console.log('request error............');

  return Promise.reject(err);
};

//before return response
const beforeRes = async (res: AxiosResponse): Promise<any> => {
  console.log('before return response....입니다........');
  console.log('??', getCookie('member'));

  const data = res.data;

  if (data && data.error === 'ERROR_ACCESS_TOKEN') {
    const memberCookieValue = getCookie('member');
    //undefiend
    if (!memberCookieValue.accessToken || !memberCookieValue.refreshToken) {
      return Promise.reject();
    }

    //accessToken 과 refreshToken 둘 다 있으면
    const result = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken); //새로 갱신
    console.log('refreshJWT RESULT', result);

    memberCookieValue.accessToken = result.accessToken;
    memberCookieValue.refreshToken = result.refreshToken;

    setCookie('member', JSON.stringify(memberCookieValue), 1);

    //원래의 호출
    const originalRequest = res.config;

    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

    return await axios(originalRequest);
  }

  console.log('reee', res);
  return res;
};

//fail response
const responseFail = (err: AxiosError | Error): Promise<Error> => {
  console.log('response fail error.............');

  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);

jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;

