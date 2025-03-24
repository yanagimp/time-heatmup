"use client";
import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip} from "react-tooltip";

export default function Home() {
  type HeatmapEntry = {
    date: string;
    count: number;
  };
  
  const [data, setData] = useState<HeatmapEntry[]>([]);
  
  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbyuHgoG7YzCjTtbicvvtgn6vZs419f4b1HUqQlveFVCaSM3cK10r14SDFpor8a4PNVb/exec")
      .then((res) => res.json())
      .then((d) => {
        const converted: HeatmapEntry[] = d.map((entry: any) => ({
          date: entry.date,
          count: entry.minutes / 60,
        }));
        setData(converted);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🌱 My Time Heatmap</h1>
      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={data}
        tooltipDataAttrs={(value: any) => {
          if (!value?.date) return {};
          const h = Math.floor(value.count);
          const m = Math.round((value.count - h) * 60);
          return {
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": `${h}h ${m}m`,
          };
        }}
        
        classForValue={(value: any) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count < 1) return "color-scale-1";
          if (value.count < 3) return "color-scale-2";
          if (value.count < 5) return "color-scale-3";
          return "color-scale-4";
        }}
      />
      <Tooltip id="heatmap-tooltip" />
    </div>
  );
}
