
import React, { useEffect, useRef } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";


import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip,Legend
} from "chart.js";
  
ChartJS.register( CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

export default function BarChart({ labels, data , variant }){
const theme = useTheme(); 
const colors = tokens(theme.palette.mode)
const canvasRef = useRef(null); 
const chartRef = useRef(null);  

const size =
    variant === "large"
      ? { height: 700, width: 900 }
      : { height: 500, width: 500 };

useEffect(() => {
  if (!canvasRef.current) return;
    
  if (chartRef.current) {
        chartRef.current.destroy();
  }
  
    
  const ctx = canvasRef.current.getContext("2d");
   
  chartRef.current = new ChartJS(ctx, {
    type: "bar",
    data: {
    labels,
    datasets: [{
        data,
          label: "Most common Ip Adressess", 
          backgroundColor: data.map(() => colors.blueAccent[500]),
          borderWidth: 1,
          borderRadius: 10, 
        }] 
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    });
  
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [labels, data]);


  return (
    <div style={{ height: size.height, width: size.width }}>
      <canvas ref={canvasRef} /> 
    </div>
  );

}