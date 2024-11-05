"use client";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import React, {useEffect} from "react";
import "../../../../js/world";
import {MapResponse} from "@/interface/MapResponse";


const CountryMap = ({countries}:{countries:Array<MapResponse> | undefined}) => {
  useEffect(() => {
    // const data = [{"country": "KR", totalSales: 123377},{"country": "AM", totalSales: 1000}]
    let result = {};
    countries?.map((d) => {
      if (d.totalSales < 1000000 ) { //1000000
        result = {...result, [d.country]: "Under_1000000"};
      } else if (d.totalSales < 2000000) { //2000000
        result = {...result, [d.country]: "Under_2000000"};
      } else if (d.totalSales < 3000000 ) { //3000000
        result = {...result, [d.country]: "Under_3000000"};
      } else {
        result = {...result, [d.country]: "More_than_3000000"};
      }
    });

    console.log('result', result);
    const mapOne = new jsVectorMap({
      selector: "#mapOne",
      focusOn: {
        // regions: ['EG', 'KR'],
        animate: true
      },
      series: {
        regions: [{
          attribute: "fill",
          legend: {
            title: "Country"
          },
          scale: {
            Under_1000000: "#A2B6F2",
            Under_2000000: "#6a8df7",
            Under_3000000: "#2d5df7",
            More_than_3000000: "#033fff"
          },
          values: {...result},
          // values: {
          //   CN: "myScaleTwo",
          //   MX: "myScaleOne",
          //   LY: "myScaleOne",
          //   RU: "myScaleThree",
          //   KR: "myScaleFour",
          // }
        }],
      }
    });


    return () => {
      // const map = document.getElementById("mapOne");
      // if (map) {
      //   map.innerHTML = "";
      // }
      mapOne.destroy();
    };
  }, []);


  return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
        <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Sales by billing location: country
        </h4>
        <p className="mb-2 text-base font-normal text-gray-500 dark:text-white">
          Shows the total sales by country.
        </p>

        <div className="h-90 mt-10">
          <div id="mapOne" className="mapOne map-btn"></div>
        </div>
      </div>
  );
};

export default CountryMap;
