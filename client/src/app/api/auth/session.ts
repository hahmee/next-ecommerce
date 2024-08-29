import {NextApiRequest, NextApiResponse} from "next";
import {getCookie, setCookie} from "cookies-next";
import {Member} from "@/interface/Member";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log('??????????????????????????');
    console.log(req.body);
    //API요청이 POST일 때만 허용
    if(req.method === "POST") {
        try {
            console.log('....POST', req.body);

            const {accessToken, refreshToken} = req.body;

            if(accessToken && refreshToken) {


                // if()
                // const memberCookie = getCookie("member");
                const memberCookie = getCookie("member");

                //어세스, 리프레시 토큰 제외한 값은 유지


                const newCookie = { accessToken: accessToken, refreshToken: refreshToken} as Member;
                const expires = new Date();
                expires.setUTCDate(expires.getUTCDate() + 1);

                setCookie("member", newCookie ,{
                    req,
                    res,
                    path: '/',
                    maxAge: 60 * 60 * 24,
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                });


                res.status(200).json({message: "토큰 저장 성공!"});
            }else {
                res.status(400)
                    .json({ message: '토큰 저장 실패 | 토큰이 존재하지 않습니다.' });
            }

        }catch (error) {
            res.status(500).json({ message: '토큰 저장에 실패하였습니다.' });
        }
    }else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}