import { useRef, useEffect, useState } from "react";
import useGridStore from "@/stores/useGridStore";
import useSettingStore from "@/stores/useSettingStore";
import { drawGrids, generateDatesInYear, generateGridData } from "@/utils";

export default function Grid() {
  // Global states: useGridStore
  const { year, tasksInTheYear } = useGridStore();
  const { weekStart } = useSettingStore();

  const gridRef = useRef(null);
  const tooltipRef = useRef(null);
  const daysInYear = generateDatesInYear(year);
  const tasksInYear = generateGridData(daysInYear, tasksInTheYear);

  // State to track mouse position
  const [mousePosLocal, setMousePosLocal] = useState({ x: 0, y: 0 });

  // Draw grids
  useEffect(() => {
    drawGrids(
      gridRef,
      tasksInYear,
      year,
      weekStart,
      26,
      tooltipRef,
      setMousePosLocal
    );
  }, [tasksInTheYear, weekStart]);

  const position = {
    top: mousePosLocal.y + 10,
    left: mousePosLocal.x + 20,
  };

  return (
    <div className="mb-16">
      <div className="overflow-x-scroll no-scrollbar" ref={gridRef}></div>
      <div
        className="tooltip bg-slate-900 rounded text-white fixed text-xs p-3"
        style={position}
        ref={tooltipRef}
      ></div>
    </div>
  );
}
