import { useRef, useEffect, MutableRefObject } from "react";
import * as d3 from "d3";

export interface IGridData {
  date: Date;
  number_of_minutes: number;
}

function daysInYear(year: number) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}

function generateDatesInYear(year: number): IGridData[] {
  const numberOfDaysInYear = daysInYear(year);

  const data = [];

  for (let i = 0; i < numberOfDaysInYear; i++) {
    const date = new Date("2023-01-01");
    date.setDate(date.getDate() + i);
    const day = {
      date: new Date(date),
      number_of_minutes: i * 5,
    };
    data.push(day);
  }

  return data;
}

function generateGridData() {}

function drawGrids(
  reference: MutableRefObject<null>,
  data: IGridData[],
  weekStartType: string, // "monday", "sunday"
  width: number,
  cellSize: number
) {
  // Calculate values
  const X = d3.map(data, (d) => d.date); // Array of dates
  const Y = d3.map(data, (d) => d.number_of_minutes); // Array of num_of_minutes
  const I = d3.range(X.length);

  const dayOfWeek =
    weekStartType === "sunday" ? (i: number) => i : (i: number) => (i + 6) % 7; // [0-7];
  const startOfWeekDate =
    weekStartType === "sunday" ? d3.utcSunday : d3.utcMonday; //
  const numOfDaysInWeek = 7; // Number of days in week
  const height = cellSize * (numOfDaysInWeek + 2);

  // Create grid container
  const container = d3
    .select(reference.current)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "pink");

  // Create individual grid cells
  const cell = container
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr(
      "x",
      (d, i) => startOfWeekDate.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5
    )
    .attr("y", (d, i) => dayOfWeek(X[i].getUTCDay()) * cellSize + 0.5)
    .attr("fill", "white");
}

export default function Grid() {
  const gridRef = useRef(null);
  const year = 2023;
  const data = generateDatesInYear(year);

  useEffect(() => {
    drawGrids(gridRef, data, "monday", 1280, 25);
  });

  return <div className="my-4" ref={gridRef}></div>;
}
