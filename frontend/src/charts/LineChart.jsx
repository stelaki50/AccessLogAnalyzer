import React, { useEffect, useRef } from "react";
import "chartjs-adapter-date-fns";

import { Chart as ChartJS, LineController, LineElement, PointElement, CategoryScale,TimeScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineController, LineElement, PointElement, CategoryScale,TimeScale,TimeScale, LinearScale, Title, Tooltip, Legend);

export default function LineChart({ labels, data, variant  }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const size =
  variant === "large"
    ? { height: 700, width: 1100 }
    : { height: 500, width: 700 };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
        chartRef.current.destroy();
    }

    const chartData = {
        labels: labels,
         datasets: [
           {
             label: "Requests Per Minute",
             data: data,
             borderColor: "rgb(75, 192, 192)",
             tension: 0.5,
           },
         ],
    };

    const ctx = canvasRef.current.getContext("2d");

     chartRef.current = new ChartJS(ctx, {
       type: "line",
       data: chartData,
       maintainAspectRatio: false,
       options: {
          responsive: true,
          maintainAspectRatio: false,
      },
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