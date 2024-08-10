'use client';
import {ChangeEventHandler, FormEventHandler, useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();


    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setMessage('');
        console.log('dddddddddddddddddddddddddddddd', email, password);

        try {
            const response = await signIn("credentials", {
                username:email,
                password:password,
                redirect: false,
            })
            console.log('response입니다만...', response);
            if (!response?.ok) {
                console.log('아이디와 비밀번호가 일치하지 않습니다.')
                setMessage('아이디와 비밀번호가 일치하지 않습니다.');
            } else {
                router.replace('/');
            }
        } catch (err) {
            console.error(err);
            console.log('아이디와 비밀번호가 일치하지 않습니다.')
            setMessage('아이디와 비밀번호가 일치하지 않습니다.');
        }
    };


    const handleSignup = () => {
        router.push('/signup');
    }

    return (

        <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form className="flex flex-col gap-8" onSubmit ={handleSubmit}>
                <h1 className="text-2xl font-semibold">로그인</h1>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">사용자 이메일</label>
                    <input
                        type="email"
                        name="username"
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
                {message && <div className="text-green-600 text-sm">{message}</div>}

            </form>
        </div>
    )
}