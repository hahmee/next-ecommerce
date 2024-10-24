import {SessionDTO} from "@/interface/GAResponse";

const BarChart = ({data, maxValue} : {data: SessionDTO, maxValue:number }) => {

    return (
        <>
            <div className="w-full bg-gray-300 rounded h-2">
                <div className="bg-primary-500 h-full rounded" style={{width: `${(Number(data.value) / maxValue) * 100}%`}}></div>
            </div>
        </>
    );
}
export default BarChart;
