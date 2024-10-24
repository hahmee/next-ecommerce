import {TopPageDTO} from "@/interface/GAResponse";

const BarChart = ({data, maxValue} : {data: TopPageDTO, maxValue:number }) => {

    return (
        <>
            <div className="w-full bg-gray-300 rounded h-2">
                <div className="bg-primary-500 h-full rounded" style={{width: `${(Number(data.pageSessions) / maxValue) * 100}%`}}></div>
            </div>
        </>
    );
}
export default BarChart;
