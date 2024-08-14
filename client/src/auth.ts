/*
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {setCookie} from "@/utils/cookieUtil";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  callbacks: {
    jwt({ token, user}) {
      console.log('auth.ts jwt입니다.', token);
      console.log('auth.ts jwt2222입니다.', user);

      // if(user) {
      //   //Intial Login에만 user가 존재
      //   return {
      //     ...user,
      //     accessToken: user.accessToken,
      //     expiresAt: Math.floor(Date.now() / 1000 + user.expiresIn),
      //     refreshToken: user.refreshToken
      //   };
      //

      return token;
    },
    session({ session, newSession, user}) {
      // console.log('auth.ts session입니다.', session, newSession, user);
      return session;
    }
  },
  events: {
    signOut(data) {
      console.log('auth.ts events signout', 'session' in data && data.session, 'token' in data && data.token);
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: 'include'
      })
      // if ('session' in data) {
      //   data.session = null;
      // }
      // if ('token' in data) {
      //   data.token = null;
      // }
    },
    session(data) {
      console.log('auth.ts events session', 'session' in data && data.session, 'token' in data && data.token);
    }
  },
  providers: [
      CredentialsProvider({
      async authorize(credentials) { //프로미스 반환
        console.log('credentials입니다...', credentials);
        const authResponse = await fetch(`${process.env.AUTH_URL}/api/member/login`, {
          method: "POST",
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            username: credentials.username as string,
            password: credentials.password as string,
          })
        });

        const user = await authResponse.json();
        console.log('백엔드에서 받아온 결과로 만든 user입니다.', user);

        if (user) {
          setCookie('member', JSON.stringify(user), 1);
        }

        if (!authResponse.ok) {
          return null
        }

        return {
          email: user.email,
          name: user.nickname,
          // image: user.image,
          ...user, //JWT로 부호화 됨
        }
      },
    }),
  ]
});
*/
