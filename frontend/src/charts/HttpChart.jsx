
import React, { useEffect, useRef, useState } from "react";

import { Chart as ChartJS, CategoryScale, BarController, LinearScale, BarElement, Title, Tooltip, Legend}  
from "chart.js";
ChartJS.register( CategoryScale, BarController, LinearScale, BarElement, Title, Tooltip, Legend);


export default function HttpChart({ labels, data, variant }){
const canvasRef = useRef(null); 
const chartRef = useRef(null);  

const size =
    variant === "large"
      ? { height: 700, width: 1200 }
      : { height: "100%", width: "100%" };

useEffect(() => {

  if (!canvasRef.current) return;

  if (chartRef.current){
    chartRef.current.destroy();
  }

  const statusCodes = ['2xx', '3xx', '4xx', '5xx'];
  const colors = { '2xx': '#2ecc71','3xx': '#27ae60','4xx': '#f39c12','5xx': '#e74c3c'};

  const chartData = {
      labels: labels,
      datasets: statusCodes.map(code => ({
        label: code,
        data: data.map(item => item[code] ?? 0),
        backgroundColor: colors[code],
        stack: 'requests'
      }))
  };

  const ctx = canvasRef.current.getContext("2d"); 

  chartRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: chartData,
        layout:{
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
        }
      },
      options: {
        maintainAspectRatio: false,
        scales: {
              x: {
                stacked: true,
                offset: true
              },
              y:{
                stacked: true
              }
        }  
    }
  });

  return () => {
    chartRef.current?.destroy();
    chartRef.current = null;
  };
  },[labels, data]);

  return (
    <div style={{ height: size.height, width: size.width }}>
          <canvas ref={canvasRef} /> 
    </div>
  );

}