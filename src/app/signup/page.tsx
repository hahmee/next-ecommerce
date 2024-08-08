'use client';

import {useFormState} from "react-dom";
import onSubmit from "../../lib/signup";

export default function SignupPage() {
    // const [formState, formAction] = useFormState(onSubmit, { message: null });


    // const [formState, formAction] = useFormState(auth.bind(null, mode), {});
    return <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
        <form id="auth-form">
            <p>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email"/>
            </p>

            <p>
                <label htmlFor="nickname">닉네임</label>
                <input id="nickname" name="nickname" type="text" placeholder="" required/>
            </p>
            <p>
                <label htmlFor="pw">Password</label>
                <input type="password" name="pw" id="pw"/>
            </p>
            <button type="submit">가입하기</button>


            <p>

            </p>
        </form>
    </div>;


};