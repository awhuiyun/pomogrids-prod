import { useRef, useEffect, MutableRefObject } from "react";
import * as d3 from "d3";
import useGridStore from "@/stores/grid";
import { ITaskInTheYear, IGridData } from "@/types/interfaces";
import { timeFormat } from "d3";

// Function to formate Date
const formatDate = timeFormat("%d/%m/%Y");

// Function to calculate number of days in year
function daysInYear(year: number) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}

// Function to generate an array of objects for each date in the year
function generateDatesInYear(year: number): IGridData[] {
  const numberOfDaysInYear = daysInYear(year);

  const data = [];

  for (let i = 0; i < numberOfDaysInYear; i++) {
    const date = new Date(year + "-01-01");

    date.setDate(date.getDate() + i);
    const day = {
      date: new Date(date),
      number_of_minutes: 0,
    };
    data.push(day);
  }

  return data;
}

// Function to populate dates with user's actual numOfMinutess data
function generateGridData(
  datesinYearArray: IGridData[],
  tasksInYearArray: ITaskInTheYear[]
) {
  const baseArray = datesinYearArray;
  const dataArray = tasksInYearArray;
  const updatedArray = [];
  console.log(dataArray);
  // "dd/mm/yyyyy" === "dd/mm/yyyyy"

  // Manipulate dataArray: {date:..., value:...}
  // Update baseArray with data from dataArray:
  for (let i = 0; i < baseArray.length; i++) {
    const date = formatDate(baseArray[i].date);
    let totalNumOfMinutes = 0;

    for (let j = 0; j < dataArray.length; j++) {
      if (dataArray[j].dateOfSession === date) {
        totalNumOfMinutes += dataArray[j].completedNumOfMinutes;
      }
    }

    const item = {
      date: baseArray[i].date,
      number_of_minutes: totalNumOfMinutes,
    };

    updatedArray.push(item);
  }

  // console.log(baseArray);
  // console.log(updatedArray);

  return updatedArray;

  // Use hashmap for efficiency instead of looping?
  // const hashMap = {
  //   "17/02/2023": 25,
  //   "18/02/2023": 18,
  // };
  // hashMap["17/02/2023"] <- get the value
}

// Funtion that draws the grids using d3.js
function drawGrids(
  reference: MutableRefObject<null>,
  data: IGridData[],
  year: number,
  weekStartType: string, // "monday", "sunday"
  cellSize: number
) {
  // Calculate values
  const dates = d3.map(data, (d) => d.date); // Array of dates
  const minutes = d3.map(data, (d) => d.number_of_minutes); // Array of num_of_minutes
  const indexes = d3.range(dates.length);
  const spaceBetweenGrids = 6;

  const dayOfWeek =
    weekStartType === "sunday" ? (i: number) => i : (i: number) => (i + 6) % 7; // returns [0-6] to correspond to a day of week
  const startOfWeekDate =
    weekStartType === "sunday" ? d3.utcSunday : d3.utcMonday; //
  const numOfDaysInWeek = 7; // Number of days in week
  const heightOfContainer =
    (cellSize + spaceBetweenGrids) * numOfDaysInWeek + cellSize;

  const daysOfWeekLabels =
    weekStartType === "sunday"
      ? ["", "Mon", "", "Wed", "", "Fri", ""]
      : ["Mon", "", "Wed", "", "Fri", "", ""];
  const monthLabels = [
    { month: "Jan", date: new Date("01-01-" + year) },
    { month: "Feb", date: new Date("02-01-" + year) },
    { month: "Mar", date: new Date("03-01-" + year) },
    { month: "Apr", date: new Date("04-01-" + year) },
    { month: "May", date: new Date("05-01-" + year) },
    { month: "Jun", date: new Date("06-01-" + year) },
    { month: "Jul", date: new Date("07-01-" + year) },
    { month: "Aug", date: new Date("08-01-" + year) },
    { month: "Sep", date: new Date("09-01-" + year) },
    { month: "Oct", date: new Date("10-01-" + year) },
    { month: "Nov", date: new Date("11-01-" + year) },
    { month: "Dec", date: new Date("12-01-" + year) },
  ];

  for (let i = 0; i < monthLabels.length; i++) {
    console.log(monthLabels[i].date);
    console.log(d3.timeYear(monthLabels[i].date));
    const x =
      startOfWeekDate.count(
        d3.timeYear(monthLabels[i].date),
        monthLabels[i].date
      ) *
        (cellSize + spaceBetweenGrids) +
      cellSize +
      spaceBetweenGrids;
    console.log(x);
  }

  // Clear previous svg
  d3.select(reference.current).select("svg").remove();

  // Create colour scale
  const originalNumOfMinsArray = d3.map(data, (d) => d.number_of_minutes);
  console.log(originalNumOfMinsArray);

  const editedNumOfMinsArray = originalNumOfMinsArray.filter((item) => {
    return item > 0;
  });

  console.log(editedNumOfMinsArray);
  const q1 = d3.quantile(editedNumOfMinsArray, 0.25);
  const q2 = d3.quantile(editedNumOfMinsArray, 0.5);
  const q3 = d3.quantile(editedNumOfMinsArray, 0.75);
  const q4 = d3.quantile(editedNumOfMinsArray, 1);

  function calculateFillColour(value: number) {
    if (q1 && q2 && q3 && q4)
      if (value === 0) {
        return "#F1F5F9";
      } else if (value <= q1) {
        return "#ADD3FF";
      } else if (value > q1 && value <= q2) {
        return "#7ABFFF";
      } else if (value > q2 && value <= q3) {
        return "#6993FF";
      } else {
        return "#3C6EEE";
      }
    return "#F1F5F9";
  }

  // Create grid container
  const container = d3
    .select(reference.current)
    .append("svg")
    .attr("width", 52 * (cellSize + spaceBetweenGrids))
    .attr("height", heightOfContainer);

  // Create labels for y-axis (days of week)
  const ylabel = container
    .append("g")
    .selectAll("text")
    .data(daysOfWeekLabels)
    .enter()
    .append("text")
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr("x", cellSize)
    .attr(
      "y",
      (d, i) =>
        (cellSize * 2) / 3 + i * (cellSize + spaceBetweenGrids) + cellSize
    )
    .attr("text-anchor", "end")
    .text((d) => d)
    .style("font-size", 12);

  // Create labels for x-axis (months of year)
  const xlabel = container
    .append("g")
    .selectAll("text")
    .data(monthLabels)
    .enter()
    .append("text")
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr(
      "x",
      (d, i) =>
        startOfWeekDate.count(
          d3.timeYear(monthLabels[i].date),
          monthLabels[i].date
        ) *
          (cellSize + spaceBetweenGrids) +
        cellSize +
        spaceBetweenGrids +
        2
    )
    .attr("y", cellSize / 2)
    .text((d) => d.month)
    .style("font-size", 12);

  // Create individual grid cells
  const cell = container
    .append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr(
      "x",
      (d, i) =>
        startOfWeekDate.count(d3.timeYear(dates[i]), dates[i]) *
          (cellSize + spaceBetweenGrids) +
        cellSize +
        spaceBetweenGrids
    )
    .attr(
      "y",
      (d, i) =>
        dayOfWeek(dates[i].getDay()) * (cellSize + spaceBetweenGrids) + cellSize
    )
    .attr("fill", (d, i) => calculateFillColour(minutes[i]));

  // Adding tooltips
  // const tooltip = d3
  //   .select("body")
  //   .append("div")
  //   .style("position", "absolute")
  //   .style("z-index", "10")
  //   .style("visibility", "hidden")
  //   .style("background", "#000")
  //   .text("a simple tooltip");

  // container
  //   .selectAll("div")
  //   .data(data)
  //   .enter()
  //   .append("div")
  //   .attr("width", 150)
  //   .attr("height", 150)
  //   .attr("fill", "black")
  //   .text((d) => d.number_of_minutes)
  //   .on("mouseover", function (d) {
  //     tooltip.text(d);
  //     tooltip
  //       .style("top", d3.event.pageY - 10 + "px")
  //       .style("left", d3.event.pageX + 10 + "px");
  //     return tooltip.style("visbility", "visible");
  //   })
  //   .on("mouseout", function (d) {
  //     tooltip.style("visbility", "hidden");
  //   });
}

export default function Grid() {
  // Global states: useGridStore
  const { year, tasksInTheYear } = useGridStore();

  const gridRef = useRef(null);
  const daysInYear = generateDatesInYear(year);
  const tasksInYear = generateGridData(daysInYear, tasksInTheYear);

  useEffect(() => {
    drawGrids(gridRef, tasksInYear, year, "monday", 26);
  }, [tasksInTheYear]);

  return (
    <div
      className="w-[1280px] mb-16 overflow-x-scroll no-scrollbar"
      ref={gridRef}
    ></div>
  );
}
