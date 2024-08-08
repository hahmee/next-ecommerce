'use client';
import {ChangeEventHandler, FormEventHandler, useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
// import from "@/"
export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    // const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    //     console.log('dddddddddddddddddddddddddddddd', email, password);
    //     e.preventDefault();
    //     try {
    //         const response = await signIn("credentials", {
    //             email,
    //             pw:password,
    //             redirect: false,
    //         });
    //
    //         console.log('response',response)
    //
    //     } catch (err) {
    //         console.error(err);
    //         setMessage('아이디와 비밀번호가 일치하지 않습니다.');
    //     }
    // };

    const onChangeEmail: ChangeEventHandler<HTMLInputElement> = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value);
    };

    return <div
        className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
        {/*<form id="auth-form" onSubmit ={onSubmit}>*/}
        <form id="auth-form">
            <p>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" onChange={onChangeEmail}/>
            </p>

            <p>
                <label htmlFor="pw">Password</label>
                <input type="password" name="pw" id="pw" onChange={onChangePassword}/>
            </p>
            <button type="submit">로그인하기D</button>

        </form>
    </div>;

}