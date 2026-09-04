import React, { useEffect, useRef, useMemo } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// This Bar Chart displays the 10 Ips with the highest 4xx status code percentage

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

export default function BarChart({ labels = [], data = [], variant }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const size =
    variant === "large"
      ? { height: 700, width: 900 }
      : { height: 350, width: 350 };

  // Only keep IPs that actually have a 4xx percentage recorded.
  // Treat null, undefined, "", NaN, AND 0 as "no data".
  const { filteredLabels, filteredData } = useMemo(() => {
    const fLabels = [];
    const fData = [];
    labels.forEach((label, i) => {
      const value = data[i];
      const hasData =
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !Number.isNaN(Number(value)) &&
        Number(value) > 0;

      if (hasData) {
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
            label: "Higher 4xx Presentages",
            backgroundColor: filteredData.map(() => colors.redAccent[300]),
            borderWidth: 1,
            borderRadius: 10,
          },
        ],
      },
      options: {
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