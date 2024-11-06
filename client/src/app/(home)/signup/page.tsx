'use client';

import {useFormState, useFormStatus} from "react-dom";
import signUp from "@/libs/signup";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function SignupPage() {
    const [message, setMessage] = useState("");
    const router = useRouter();
    const [state, formAction] = useFormState(signUp, {message:null});
    const {pending} = useFormStatus();

    const handleLogin = () => {
        router.push('/login');
    }

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
                        name="password"
                        placeholder="비밀번호"
                        className="ring-2 ring-gray-300 rounded-md p-4"
                        autoComplete="true"
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
                    className="bg-ecom text-white p-2 rounded-md disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none "
                    disabled={pending}>
                    회원가입
                </button>

                {state.message && <div className="text-green-600 text-sm">{state?.message}</div>}

            </form>
        </div>);

}
