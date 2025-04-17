import {SessionDTO} from "@/interface/GAResponse";

const BarChart = ({data, totalSessions} : {data: SessionDTO<number>, totalSessions:number }) => {

    const percentage = (Number(data.value) / totalSessions) * 100;

    return (
        <>
            <div className="w-full bg-gray-200 rounded h-6">
                <div className="bg-primary-500/80 h-full rounded" style={{width: `${percentage}%`}}></div>
            </div>
        </>
    );
}

export default BarChart;


export const BarChartThin = ({ data, totalSessions }: { data: SessionDTO<number>, totalSessions: number }) => {
    // 각 나라의 sessions 비율 계산 (전체 sessions 대비)
    const percentage = (Number(data.value) / totalSessions) * 100;

    return (
        <div className="flex items-center">
            {/* 막대그래프 영역 */}
            <div className="w-full bg-gray-200 rounded h-2 mr-2">
                <div
                    className="bg-primary-500 h-full rounded"
                    style={{ width: `${percentage}%`}}
                ></div>
            </div>
            {/* 퍼센티지 텍스트 */}
            <span className="text-xs text-black font-bold">{percentage.toFixed(0)}%</span>
        </div>
    );
};