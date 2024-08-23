
import NextAuth from 'next-auth';
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import {setCookie} from "@/utils/setCookieUtil";

const handler = NextAuth({
    pages: {
        signIn: '/login',
        newUser: '/signup',
    },
    callbacks: {
        // 토큰 관련 action 시 호출되는 Callback
        // useSession 이나 getSession 과 같은 함수를 호출할 때마다 jwt 콜백함
        async jwt({ token, user, account, profile, isNewUser }) {
            console.log('user뭐임', user);
            console.log('jwt뭐임', token);

            // if(user) {
            //     //initial Login에만 user가 존재
            //     return {
            //         ...user,
            //     };
            // }else {
            //
            // }

            // return {'test': 'test'};
            return token;
        },
        //로그인을 한 뒤 해당 로그인 정보가 signIn callbacks 함수로 전달
        async signIn({ user, account, profile, email, credentials }) {
            console.log('userr', user);
            console.log('account', account);
            console.log('profile', profile);
            console.log('credentials', credentials);


            return true;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {//token은 위에 토큰 리턴 값임
            return session;
        }
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                //signIn부르면 실행됨
                console.log('ddddddddddddddddd', credentials);

                const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        username: credentials?.username!,
                        password: credentials?.password!,
                    })
                });

                const user = await authResponse.json();
                console.log('백엔드에서 받아온 결과로 만든 user입니다.', user);

                if (user) {
                    await setCookie('member', JSON.stringify(user), 1);
                }

                if (!authResponse.ok) {
                    return null
                }
                return {
                    // email: user.email,
                    // name: user.nickname,
                    // image: user.image,
                    ...user, //JWT로 부호화 됨
                }

            }
        })
    ],
});

export { handler as GET, handler as POST };