"use client";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import React, {useEffect} from "react";
import "../../../../js/world";
import {MapResponse} from "@/interface/MapResponse";


const CountryMap = ({countries}:{countries:Array<MapResponse> | undefined}) => {
  useEffect(() => {
    // const mapOne = new jsVectorMap({
    //   selector: "#mapOne",
    //   map: "world",
    //   zoomButtons: true,
    //
    //   regionStyle: {
    //     initial: {
    //       fill: "#A2B6F2",
    //     },
    //     hover: {
    //       fillOpacity: 1,
    //       fill: "#3056D3",
    //     },
    //   },
    //   regionLabelStyle: {
    //     initial: {
    //       fontFamily: "Satoshi",
    //       fontWeight: "semibold",
    //       fill: "#fff",
    //     },
    //     hover: {
    //       cursor: "pointer",
    //     },
    //   },
    //
    //   labels: {
    //     regions: {
    //       render(code: string) {
    //         return code.split("-")[1];
    //       },
    //     },
    //   },
    // });

    // const data = [{"country": "KR", totalSales: 123377},{"country": "AM", totalSales: 1000}]
    let result = {};
    countries?.map((d) => {
      if (d.totalSales < 1000000 ) { //3000000
        result = {...result, [d.country]: "myScaleOne"};
      } else if (d.totalSales < 2000000) { //2000000
        result = {...result, [d.country]: "myScaleTwo"};
      } else if (d.totalSales < 3000000 ) { //1000000
        result = {...result, [d.country]: "myScaleThree"};
      } else {
        result = {...result, [d.country]: "myScaleFour"};
      }
    });

    console.log('result', result);
    const mapOne = new jsVectorMap({
      selector: "#mapOne",
      series: {
        regions: [{
          attribute: "fill",
          legend: {
            title: "Some title",
          },
          scale: {
            myScaleOne: "#A2B6F2",
            myScaleTwo: "#6a8df7",
            myScaleThree: "#2d5df7",
            myScaleFour: "#033fff"
          },
          values: {...result},
          // values: {
          //   CN: "myScaleTwo",
          //   MX: "myScaleOne",
          //   LY: "myScaleOne",
          //   RU: "myScaleThree",
          //   KR: "myScaleFour",
          // }
        }]
      }
    });

    return () => {
      const map = document.getElementById("mapOne");
      if (map) {
        map.innerHTML = "";
      }
      // mapOne.destroy();
    };
  }, []);

  return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Sales by billing location: country
        </h4>
        <div className="h-90">
          <div id="mapOne" className="mapOne map-btn"></div>
        </div>
        <div>
          <div>Countries</div>
          <div>
            {
              countries?.map(country => {
                return <div key={country.country}>

                </div>
              })
            }
          </div>
        </div>
      </div>
  );
};

export default CountryMap;
