import Image from "next/image";
import {TopProductResponse} from "@/interface/TopProductResponse";

const brandData: any[] = [
  {
    logo: "/images/brand/brand-01.svg",
    name: "Google",
    visitors: 3.5,
    revenues: "5,768",
    sales: 590,
    conversion: 4.8,
  },
  {
    logo: "/images/brand/brand-02.svg",
    name: "Twitter",
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    logo: "/images/brand/brand-03.svg",
    name: "Github",
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    logo: "/images/brand/brand-04.svg",
    name: "Vimeo",
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Facebook",
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
];

const TopOrderTable = ({topProducts}: {topProducts: Array<TopProductResponse> | undefined}) => {

  return (
      <div className="rounded-sm border border-stroke bg-white  pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white sm:px-7.5 xl:pb-1">
          Top Selling items
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-4 rounded-sm bg-gray-50 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 text-center">
              <h5 className="text-sm font-bold uppercase xsm:text-base">
                Item name
              </h5>
            </div>
            <div className="p-2.5 text-center">
              <h5 className="text-sm font-bold uppercase xsm:text-base">
                Options
              </h5>
            </div>
            <div className="p-2.5 text-center">
              <h5 className="text-sm font-bold uppercase xsm:text-base">
                  Quantity
              </h5>
            </div>
            <div className="p-2.5 text-center">
              <h5 className="text-sm font-bold uppercase xsm:text-base">
                % of total
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block ">
              <h5 className="text-sm font-bold uppercase xsm:text-base">
                Gross sales
              </h5>
            </div>
          </div>

          {topProducts?.map((product, key) => (
              <div
                  className={`grid grid-cols-4 sm:grid-cols-5 ${
                      key === brandData.length - 1
                          ? ""
                          : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={key}
              >
                <div className="flex items-center gap-3 p-2.5">
                  <div className="flex-shrink-0">
                    <Image src={product.thumbnail || "/images/mall/no_image.png"} alt="image" width={500} height={500} className="object-cover w-15 h-10 flex-none"/>
                  </div>
                  <p className="hidden text-black dark:text-white sm:block">
                    {product.pname}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <span
                        className="bg-primary-100 text-primary-800 text-xs px-1.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 mr-2">
                      {product.size}
                    </span>
                  <span
                      className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      {product.color.text}
                    </span>
               </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{product.quantity.toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{product.total.toLocaleString()}%</p>
                </div>


                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-meta-5">{product.grossSales.toLocaleString()}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default TopOrderTable;
