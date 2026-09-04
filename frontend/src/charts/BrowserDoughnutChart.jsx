import React, { useEffect, useRef,} from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme"; 

import { Chart as ChartJS,ArcElement,Tooltip,Legend,CategoryScale,BarController,BarElement,LinearScale,DoughnutController, 
} from "chart.js";

ChartJS.register(ArcElement,Tooltip,Legend,CategoryScale,BarController,BarElement,LinearScale,DoughnutController,);

export default function DoughnutChart({ labels, data , variant }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const canvasRef = useRef(null); 
  const chartRef = useRef(null);  

  const size =
    variant === "large"
      ? { height: 700, width: 700 }
      : { height: 350, width: 350 };


  useEffect(() => {
    
    if (!canvasRef.current) return;

    if (chartRef.current) {
        chartRef.current.destroy();
    }

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Browser Distribution",
          data: data,
          backgroundColor: [
          colors.blueAccent[500],
          colors.greenAccent[500],
          colors.redAccent[500],
          colors.blueAccent[300],
          colors.greenAccent[300],
          colors.grey[300],
          ],
        },
      ],
    };

    const ctx = canvasRef.current.getContext("2d"); 

    chartRef.current = new ChartJS(ctx, {
      type: "doughnut",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "40%",
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20, 
              boxWidth: 30,
            },
          },
        },
        layout: {
          padding: {
            right: 100,  
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };

  },[labels, data]);
  
   return (
     <div style={{height: size.height, width: size.width ,position: "relative",}}>
       <canvas ref={canvasRef} /> 
     </div>
   );
}