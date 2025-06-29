    "use client";
    import {FormEvent, FormEventHandler, useState} from "react";
    import {useRouter} from "next/navigation";
    import {DataResponse} from "@/interface/DataResponse";
    import {Member} from "@/interface/Member";
    import {getCookie, setCookie} from "@/utils/cookie";
    import {MemberRole} from "@/types/memberRole";
    import toast from "react-hot-toast";
    import { useUserStore } from "@/store/userStore";
    import {useCartStore} from "@/store/cartStore";

    //최고 role 선택하는 함수
    const getHighRole = (roles: MemberRole[]) => {

        // 역할의 우선순위를 정의
        const rolePriority = {
            [MemberRole.MANAGER]: 4,
            [MemberRole.ADMIN]: 3,
            [MemberRole.USER]: 2,
            [MemberRole.DEMO]: 1,
        };
        // roles 배열을 우선순위에 따라 내림차순으로 정렬
        const sortedRoles = roles.sort((a, b) => rolePriority[b] - rolePriority[a]);

        // 가장 높은 우선순위의 역할 반환
        return sortedRoles[0];
    };

    export default function LoginPage() {

        const [email, setEmail] = useState<string>('user1@aaa.com');
        const [password, setPassword] = useState<string>('1111');
        const router = useRouter();
        const [message, setMessage] = useState<string>("");
        const {user, setUser} = useUserStore();

        const onSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {
            try {
                event.preventDefault();

                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
                    method: "POST",
                    credentials: 'include', // 자동 쿠키 포함
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        username: email as string,
                        password: password as string,
                    }),
                });
                console.log('response', response);

                const data: DataResponse<Member> = await response.json();

                if (data.code != 0) { //에러있는 상황
                    setMessage(data.message);
                    return;
                } else {

                    console.log('data.data)', data.data)
                    setUser(data.data); // 전역 상태 저장

                    await setCookie("member", JSON.stringify(data.data));

                    const member = await getCookie("member") as Member | undefined;

                    if (member) {
                        toast.success("로그인 되었습니다.");
                        const roleNames = member.roleNames;
                        const role = getHighRole(roleNames);
                        const encryptedId = member.encryptedId;
                        // const encryptedId = hashUserId(email);

                    }
                    router.replace('/');
                }
            } catch (error) {
                console.error(error);
                setMessage("알 수 없는 에러입니다.")
            }
        };

        const handleSignup = () => {
            router.push('/signup');
        }

        return (
            <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
                <form className="flex flex-col gap-8" onSubmit={onSubmit}>
                    <h1 className="text-2xl font-semibold">로그인</h1>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">사용자 이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
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
                            value={password}

                            placeholder="비밀번호"
                            autoComplete="true"
                            className="ring-2 ring-gray-300 rounded-md p-4"
                            onChange={(e) => setPassword(e.target.value)}
                            required={true}
                        />
                    </div>
                    <button
                        className="bg-ecom text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed "
                        disabled={false}
                        type="submit"
                        aria-label={"login"}
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
                    {/*{message && <div className="text-green-600 text-sm">{showMessage(message)}</div>}*/}
                </form>
            </div>
        );
    };