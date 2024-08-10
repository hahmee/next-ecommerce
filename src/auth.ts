import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {cookies, headers} from 'next/headers'
import cookie from 'cookie';

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
    jwt({ token}) {
      console.log('auth.ts jwt입니다.', token);
      return token;
    },
    session({ session, newSession, user}) {
      console.log('auth.ts session입니다.', session, newSession, user);
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
      async authorize(credentials) {
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

        let setCookie = user;

        if (setCookie) {
          const oneDay = 24 * 60 * 60
          cookies().set('member', JSON.stringify(setCookie), {expires: Date.now() - oneDay}); // 브라우저에 쿠키를 심어주는 것
          console.log('cookies().toString()', cookies().toString());
        }

        // let setCookie = authResponse.headers.get('Set-Cookie');
        // console.log('set-cookie입니다.', setCookie);
        // if (setCookie) {
        //   const parsed = cookie.parse(setCookie);
        //   cookies().set('connect.sid', parsed['connect.sid'], parsed); // 브라우저에 쿠키를 심어주는 것
        // }


        if (!authResponse.ok) {
          return null
        }

        return {
          email: user.email,
          name: user.nickname,
          image: user.image,
          ...user,
        }
      },
    }),
  ]
});
