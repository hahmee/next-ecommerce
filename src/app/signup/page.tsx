'use client';

import {useFormState, useFormStatus} from "react-dom";
import onSubmit from "../../lib/signup";
import {FormEventHandler, useState} from "react";
import {useRouter} from "next/navigation";

export default function SignupPage() {
    const [message, setMessage] = useState("");
    const router = useRouter();
    const [state, formAction] = useFormState(onSubmit, {message:null});
    const {pending} = useFormStatus();
    console.log('state', state);
    const handleLogin = () => {
        router.push('/login');
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setMessage('');
    };
    return (
        <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form className="flex flex-col gap-8" action={formAction}>
                <h1 className="text-2xl font-semibold">회원가입</h1>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">사용자 이메일</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        className="ring-2 ring-gray-300 rounded-md p-4"
                        required={true}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        placeholder="닉네임"
                        className="ring-2 ring-gray-300 rounded-md p-4"
                        required={true}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">비밀번호</label>
                    <input
                        type="password"
                        name="pw"
                        placeholder="비밀번호"
                        className="ring-2 ring-gray-300 rounded-md p-4"
                        required={true}
                    />
                </div>
                <div
                    className="text-sm underline cursor-pointer"
                    onClick={handleLogin}
                >
                    계정이 있으신가요?
                </div>
                <button
                    className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed "
                    disabled={false}>
                    회원가입
                </button>

                {message && <div className="text-green-600 text-sm">{message}</div>}

            </form>
        </div>);

}

//     return <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
//         <form id="auth-form">
//             <p>
//                 <label htmlFor="email">Email</label>
//                 <input type="email" name="email" id="email"/>
//             </p>
//
//             <p>
//                 <label htmlFor="nickname">닉네임</label>
//                 <input id="nickname" name="nickname" type="text" placeholder="" required/>
//             </p>
//             <p>
//                 <label htmlFor="pw">Password</label>
//                 <input type="password" name="pw" id="pw"/>
//             </p>
//             <button type="submit">가입하기</button>
//
//
//             <p>
//
//             </p>
//         </form>
//     </div>;
//
//
// };