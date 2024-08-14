
import NextAuth from 'next-auth';
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import {setCookie} from "@/utils/cookieUtil";

const handler = NextAuth({
    pages: {
        signIn: '/login',
        newUser: '/signup',
    },
    callbacks: {
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
        async session({ session, user, token }) {
            return session
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
                // console.log('백엔드에서 받아온 결과로 만든 user입니다.', user);

                if (user) {
                    setCookie('member', JSON.stringify(user), 1);
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