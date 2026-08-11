import React, { useEffect, useRef, useMemo } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,BarController,Title,Tooltip,Legend,
}from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

// This is a horizontal Bar chart that displays the highest duration sessions from the log file //

export default function BarChart({ labels = [], data = [], variant }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const size =
    variant === "large"
      ? { height: 700, width: 900 }
      : { height: 350, width: 500 };

  const { filteredLabels, filteredData } = useMemo(() => {
    const fLabels = [];
    const fData = [];
    labels.forEach((label, i) => {
      const value = data[i];
      const hasSession =
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !Number.isNaN(Number(value)) &&
        Number(value) > 0;

      if (hasSession) {
        fLabels.push(label);
        fData.push(value);
      }
    });
    return { filteredLabels: fLabels, filteredData: fData };
  }, [labels, data]);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: filteredLabels,
        datasets: [
          {
            data: filteredData,
            label: "Highest session durations",
            backgroundColor: filteredData.map(() => colors.blueAccent[500]),
            borderWidth: 1,
            borderRadius: 10,
          },
        ],
      },
      options: {
        indexAxis: "y",
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [filteredLabels, filteredData, colors]);

  return (
    <div style={{ height: size.height, width: size.width }}>
      <canvas ref={canvasRef} />
    </div>
  );
}