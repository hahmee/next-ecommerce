"use client";
import React, {useState} from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayout({children, modal}: { children: React.ReactNode, modal: React.ReactNode }) {


    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // useEffect(() => {
    //     setTimeout(() => setLoading(false), 1000);
    // }, []);

    return (
        <>
            <div className="dark:bg-boxdark-2 dark:text-bodydark bg-graylight">

                {modal}
                {/*{loading ? <Loader/> : children}*/}

                {/* <!-- ===== Page Wrapper Start ===== --> */}
                <div className="flex">
                    {/* <!-- ===== Sidebar Start ===== --> */}
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                    {/* <!-- ===== Sidebar End ===== --> */}

                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col lg:ml-72.5 overflow-hidden">
                        {/* <!-- ===== Header Start ===== --> */}
                        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                        {/* <!-- ===== Header End ===== --> */}

                        {/* <!-- ===== Main Content Start ===== --> */}
                        <main className="overflow-x-auto">{/* overflow-x-auto 추가 */}
                            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                                {children}
                            </div>
                        </main>
                        {/* <!-- ===== Main Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
                {/* <!-- ===== Page Wrapper End ===== --> */}
            </div>
        </>

    );

    // const [sidebarOpen, setSidebarOpen] = useState(false);
    // return (
    //     <>
    //         {/* <!-- ===== Page Wrapper Start ===== --> */}
    //         <div className="flex">
    //
    //             {/* <!-- ===== Sidebar Start ===== --> */}
    //             <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
    //             {/* <!-- ===== Sidebar End ===== --> */}
    //
    //             {/* <!-- ===== Content Area Start ===== --> */}
    //             <div className="relative flex flex-1 flex-col lg:ml-72.5">
    //                 {/* <!-- ===== Header Start ===== --> */}
    //                 <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
    //                 {/* <!-- ===== Header End ===== --> */}
    //
    //                 {/* <!-- ===== Main Content Start ===== --> */}
    //                 <main>
    //                     <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    //                         {children}
    //                     </div>
    //                 </main>
    //                 {/* <!-- ===== Main Content End ===== --> */}
    //             </div>
    //             {/* <!-- ===== Content Area End ===== --> */}
    //         </div>
    //         {/* <!-- ===== Page Wrapper End ===== --> */}
    //     </>
    // );
};
