import {SessionDTO} from "@/interface/GAResponse";

const BarChart = ({data, maxValue} : {data: SessionDTO<number>, maxValue:number }) => {

    return (
        <>
            <div className="w-full bg-gray-200 rounded h-6">
                <div className="bg-primary-500/80 h-full rounded" style={{width: `${(Number(data.value) / maxValue) * 100}%`}}></div>
            </div>
        </>
    );
}

export default BarChart;


export const BarChartThin = ({data, maxValue} : {data: SessionDTO<number>, maxValue:number }) => {

    return (
        <>
            <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-primary-500 h-full rounded" style={{width: `${(Number(data.value) / maxValue) * 100}%`}}></div>
            </div>
        </>
    );
}