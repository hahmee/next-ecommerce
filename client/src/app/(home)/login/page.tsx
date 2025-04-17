    "use client";
    import {FormEvent, FormEventHandler, useState} from "react";
    import {useRouter} from "next/navigation";
    import {DataResponse} from "@/interface/DataResponse";
    import {Member} from "@/interface/Member";
    import {sendGTMEvent} from "@next/third-parties/google";
    import {getCookie, setCookie} from "@/utils/cookie";
    import {MemberRole} from "@/types/memberRole";
    import toast from "react-hot-toast";
    // import {getCookie} from "cookies-next";
    //
    // export function showMessage (message: string | null) {
    //     if (message === 'no_email') {
    //         return '이메일을 입력하세요.';
    //     }
    //     if (message === 'no_password') {
    //         return '비밀번호를 입력하세요.';
    //     }
    //     if (message === 'no_name') {
    //         return '닉네임을 입력하세요.';
    //     }
    //     if(message === 'email_exists') {
    //         return '이미 사용 중인 이메일입니다.';
    //     }
    //     if(message === 'nickname_exists') {
    //         return '이미 사용 중인 닉네임입니다.';
    //     }
    //     if(message === 'unknown_error') {
    //         return '알 수 없는 에러입니다.';
    //     }
    //     return message;
    // }

    // // User-ID 암호화 함수
    // const hashUserId = (userId: string) => {
    //     return crypto.createHash("sha256").update(userId).digest("hex");
    // };

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

        const [email, setEmail] = useState<string>('');
        const [password, setPassword] = useState<string>('');
        const router = useRouter();
        const [message, setMessage] = useState<string>("");

        const onSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {
            try {
                event.preventDefault();

                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        username: email as string,
                        password: password as string,
                    }),
                });

                const data: DataResponse<Member> = await response.json();

                if (data.code != 0) { //에러있는 상황
                    setMessage(data.message);
                } else {
                    /*해결법- apis route에서 set Cookie 한다.*/
                    // await fetch("/apis/auth", {
                    //     method: "POST",
                    //     body: JSON.stringify(data.data),
                    // });

                    //쿠키 세팅
                    const expires = new Date();
                    expires.setUTCDate(expires.getUTCDate() + 1);
                    // cookies().set("member", JSON.stringify(data), {expires: expires});
                    await setCookie("member", JSON.stringify(data.data));

                    // const memberInfo = getCookie('member');
                    // const member = memberInfo ? JSON.parse(memberInfo) : null;

                    // const member = cookies().get('member') as Member | undefined;

                    const member = await getCookie("member") as Member | undefined;

                    if (member) {
                        toast.success("로그인 되었습니다.");
                        const roleNames = member.roleNames;
                        const role = getHighRole(roleNames);
                        const encryptedId = member.encryptedId;
                        // const encryptedId = hashUserId(email);

                        // 로그인 성공 시 GTM 이벤트 전송
                        sendGTMEvent({
                            event: 'login',
                            uid: encryptedId, // 백엔드에서 받은 사용자 ID를 전송
                            user_role: role, // 임의
                            custom_user_id: encryptedId,
                        });
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
                    {/*<div*/}
                    {/*    className="text-sm underline cursor-pointer"*/}
                    {/*>*/}
                    {/*    비밀번호를 잃어버렸나요?*/}
                    {/*</div>*/}
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