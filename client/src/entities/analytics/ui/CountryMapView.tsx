'use client';

import 'jsvectormap/dist/jsvectormap.css';
import '@/js/world';

import jsVectorMap from 'jsvectormap';
import React, { useEffect } from 'react';

import { MapResponse } from '@/entities/analytics/model/MapResponse';

const CountryMapView = ({ countries }: { countries: Array<MapResponse> | undefined }) => {
  useEffect(() => {
    // const data = [{"country": "KR", totalSales: 123377},{"country": "AM", totalSales: 1000}]
    let result = {};
    countries?.map((d) => {
      if (d.totalSales < 100000) {
        result = { ...result, [d.country]: '10만원 이하' };
      } else if (d.totalSales < 200000) {
        result = { ...result, [d.country]: '20만원 이하' };
      } else if (d.totalSales < 300000) {
        result = { ...result, [d.country]: '30만원 이하' };
      } else {
        result = { ...result, [d.country]: '30만원 이상' };
      }
    });

    const mapOne = new jsVectorMap({
      selector: '#mapOne',
      focusOn: {
        // regions: ['EG', 'KR'],
        animate: true,
      },
      series: {
        regions: [
          {
            attribute: 'fill',
            legend: {
              title: 'Country',
            },
            scale: {
              '10만원 이하': '#A2B6F2',
              '20만원 이하': '#6a8df7',
              '30만원 이하': '#2d5df7',
              '30만원 이상': '#033fff',
            },
            values: { ...result },
            // values: {
            //   CN: "myScaleTwo",
            //   MX: "myScaleOne",
            //   LY: "myScaleOne",
            //   RU: "myScaleThree",
            //   KR: "myScaleFour",
            // }
          },
        ],
      },
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
    <>
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Sales by billing location: country
      </h4>
      <p className="mb-2 text-base font-normal text-gray-500 dark:text-white">
        Shows the total sales by country.
      </p>

      <div className="h-90 mt-10">
        <div id="mapOne" className="mapOne map-btn" />
      </div>
    </>
  );
};

export default CountryMapView;
