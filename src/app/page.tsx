"use client";
import Slider from "@/components/Slider";
import {useSession} from "next-auth/react";


const HomePage = () => {
    const { data: session } = useSession()
    return (
        <div className=''>
            <Slider/>

        </div>
    )
};

export default HomePage