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

// This Bar Chart displays the 10 most common Ip Addresses in the log file

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

// Formats an hour number (0-23) into "HH:00" format, e.g. 0 -> "00:00", 9 -> "09:00", 23 -> "23:00"
const formatHour = (hour) => {
  const h = Number(hour);
  if (Number.isNaN(h)) return hour;
  return `${String(h).padStart(2, "0")}:00`;
};

export default function BarChart({ labels, data, variant }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const size =
    variant === "large"
      ? { height: 700, width: 900 }
      : { height: 500, width: 500 };

  // Guarantee all 24 hours (0-23) are present and in order, even if the
  // incoming labels/data only include hours that had activity.
  const { fullLabels, fullData } = useMemo(() => {
    const countByHour = new Array(24).fill(0);

    (labels || []).forEach((label, i) => {
      const hour = Number(label);
      if (!Number.isNaN(hour) && hour >= 0 && hour <= 23) {
        countByHour[hour] = data?.[i] ?? 0;
      }
    });

    const hLabels = countByHour.map((_, hour) => hour);
    return { fullLabels: hLabels, fullData: countByHour };
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
        labels: fullLabels,
        datasets: [
          {
            data: fullData,
            label: "Hourly Activity",
            backgroundColor: fullData.map(() => colors.blueAccent[500]),
            borderWidth: 1,
            borderRadius: 10,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
              autoSkip: false,
              callback: function (value) {
                const label = this.getLabelForValue(value);
                return formatHour(label);
              },
            },
          },
          y: { stacked: true },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function (items) {
                if (!items.length) return "";
                return formatHour(items[0].label);
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [fullLabels, fullData, colors]);

  return (
    <div style={{ height: size.height, width: size.width }}>
      <canvas ref={canvasRef} />
    </div>
  );
}