"use client";
import {FormEvent, FormEventHandler, useState} from "react";
import {useRouter} from "next/navigation";
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";
import {useFormState} from "react-dom";
import login from "@/actions/auth-actions";

export function showMessage (message: string | null) {
    console.log('message', message);
    if (message === 'no_email') {
        return '이메일을 입력하세요.';
    }
    if (message === 'no_password') {
        return '비밀번호를 입력하세요.';
    }
    if (message === 'no_name') {
        return '닉네임을 입력하세요.';
    }
    if(message === 'email_exists') {
        return '이미 사용 중인 이메일입니다.';
    }
    if(message === 'nickname_exists') {
        return '이미 사용 중인 닉네임입니다.';
    }
    if(message === 'unknown_error') {
        return '알 수 없는 에러입니다.';
    }
    return message;
}


export default function LoginPage() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const [message, setMessage] = useState<string>("");
    // const [state, formAction] = useFormState(login, {message:null});

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {
        try {
            event.preventDefault();


            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: email as string,
                    password: password as string,
                })
            });

            const data: DataResponse<Member> = await response.json();
            if (data.code != 0) { //에러있는 상황
                setMessage(data.message);
            } else {
                /*해결법- api route에서 set Cookie 한다.*/
                await fetch("/api/auth", {
                    method: "POST",
                    body: JSON.stringify(data.data),
                });

                router.replace('/');
            }
        } catch (error) {
            console.error(error);
            setMessage("unknown_error")
        }
    };


    const handleSignup = () => {
        router.push('/signup');
    }

    return (
        <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            {/*<form className="flex flex-col gap-8" action={formAction}>*/}
                <h1 className="text-2xl font-semibold">로그인</h1>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">사용자 이메일</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        className="ring-2 ring-gray-300 rounded-md p-4"
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        autoComplete="true"
                        className="ring-2 ring-gray-300 rounded-md p-4"
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}

                    />
                </div>
                <div
                    className="text-sm underline cursor-pointer"
                >
                    비밀번호를 잃어버렸나요?
                </div>
                <button
                    className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed "
                    disabled={false}
                >
                    로그인
                </button>
                <div
                    className="text-sm underline cursor-pointer"
                    onClick={handleSignup}
                >
                    계정이 없으신가요?
                </div>
                {message && <div className="text-green-600 text-sm">{showMessage(message)}</div>}
            </form>
        </div>
    );
};