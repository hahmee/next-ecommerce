'use client';

import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";
import {MemberRole} from "@/types/memberRole";
import toast from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [message, setMessage] = useState<string>("");
    const [pending, setPending] = useState<boolean>(false);

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        setPending(true);
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        if (!formData.get('email') || !(formData.get('email') as string)?.trim()) {
            return { message: 'no_email' };
        }
        if (!formData.get('nickname') || !(formData.get('nickname') as string)?.trim()) {
            return {message: 'no_name'};
        }
        if (!formData.get('password') || !( formData.get('password') as string)?.trim()) {
            return { message: 'no_password' };
        }

        formData.set('social', 'false');
        formData.set('roleNames', MemberRole.USER);

        try {
            //회원가입
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/register`, {
                method: "POST",
                credentials: 'include',
                body: formData
            });

            const data:DataResponse<Member> = await response.json();

            //data.. {
            //   success: false,
            //   code: 401,
            //   message: 'DUPLICATED_EMAIL - 이미 사용하고 있는 이메일입니다.'
            // }

            if(!response.ok) { //백엔드에서 에러코드를 보냈다면
                setMessage(data.message);
            }else{
                toast.success("회원가입 되었습니다.");
                router.replace('/login');
            }
            setPending(false);

        } catch (err) {
            console.error(err);
            setMessage('알 수 없는 에러입니다.');
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
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
                    disabled={pending}
                    aria-label={"signUp"}
                >
                    회원가입
                </button>
                {message && <div className="text-green-600 text-sm">{message}</div>}
            </form>
        </div>
    );

}
