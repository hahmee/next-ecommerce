import Image from "next/image";
import {TopCustomerResponse} from "@/interface/TopCustomerResponse";


const TopCustomers = ({topCustomers}:{ topCustomers: Array<TopCustomerResponse> | undefined;}) => {

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white ">
                Top paying customers
            </h4>

            <div className="border-t border-stroke">
                {topCustomers?.map((customer, key) => (
                    <div
                        className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
                        key={key}
                    >
                        <div className="relative h-14 w-14 rounded-full">
                            <Image
                                width={56}
                                height={56}
                                src="https://via.placeholder.com/100"
                                alt="User"
                                style={{
                                    width: "auto",
                                    height: "auto",
                                }}
                            />
                            <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white z-10`}></span>
                        </div>

                        <div className="flex flex-1 items-center justify-between">
                            <div>
                                <h5 className="font-medium text-black dark:text-white">
                                    {customer.email}
                                </h5>
                                <p>
                                  <span className="text-sm text-black dark:text-white">
                                      {customer.payment.toLocaleString()} 원
                                  </span>
                                </p>
                                <p><span className="text-xs text-black dark:text-white">  Orders: {customer.orderCount} 건</span></p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopCustomers;
