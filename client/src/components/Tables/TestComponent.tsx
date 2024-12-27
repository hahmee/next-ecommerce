"use client";
import React, {useState} from "react";
import Datepicker from "react-tailwindcss-datepicker";

const TestComponent = () => {

    const endDate = '';// new Date(); // today
    const startDate = '';//new Date(); // today

    const [value, setValue] = useState({
        startDate: startDate,
        endDate: endDate
    } as any);

    const changeDate = (newValue:any) => {
        console.log(newValue);
         setValue(newValue)
    }

    return (
        <Datepicker
            value={value}
            onChange={changeDate}
        />
    );
    //
    // const [date, setDate] = useState({
    //     startDate: "", //기본값: 빈 값으로 -> 전체 기간 검색
    //     endDate: "",
    // });
    //
    // const dateChange = (value:any) => {
    //
    //     console.log('value', value);
    //
    //     if(!value.endDate && !value.startDate) { //null값이면
    //         setDate({startDate: "", endDate: ""});
    //         //클로즈
    //         return;
    //     }
    //     // value.startDate와 value.endDate를 Date 객체로 변환
    //     const startDate = new Date(value.startDate);
    //     const endDate = new Date(value.endDate);
    //
    //     // YYYY-MM-DD 형식으로 변환
    //     const formattedStartDate = startDate.toISOString().split("T")[0];
    //     const formattedEndDate = endDate.toISOString().split("T")[0];
    //
    //     // 두 날짜 간의 차이를 밀리초 단위로 계산
    //     const timeDifference = endDate.getTime() - startDate.getTime();
    //     // 밀리초를 일 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
    //     const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // 일 단위 차이
    //
    //     // 새로운 날짜 계산
    //     const newEndDate = new Date(startDate); // endDate 복사
    //     newEndDate.setDate(startDate.getDate() - 1); // 1일 빼기
    //
    //     const newStartDate = new Date(newEndDate); // newEndDate 복사
    //     newStartDate.setDate(newEndDate.getDate() - dayDifference); // 차이만큼 날짜 빼기
    //
    //     // 날짜 객체 설정
    //     const date = {
    //         startDate: formattedStartDate,
    //         endDate: formattedEndDate,
    //     };
    //
    //     setDate(date);
    // };
    // return <div>
    //
    //
    //     <TableDatePicker date={date} dateChange={dateChange}/>
    //
    // </div>;
}

export default TestComponent;