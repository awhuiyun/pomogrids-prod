import { MutableRefObject, SetStateAction, Dispatch } from "react";
import { IGridData, ITaskInTheYear } from "@/types";
import * as d3 from "d3";
import { timeFormat } from "d3";

/**
 * Function to format given date to "DD/MM/YYYY"
 * format, which is required by our GridData type.
 */
export const formatDate = timeFormat("%d/%m/%Y");

/**
 * Function to format given date to "Day Month Date Year"
 * format, which is required by our tool tip.
 */
export const formatDateTooltip = timeFormat("%a %b %d %Y");

/**
 * Function to convert minutes worked to hours worked if more than 60 mins
 * To display minutes/hours worked in tool tip
 */
export function convertMinsToHours(minutes: number) {
  let num;
  let type;
  if (minutes < 60) {
    num = minutes;
    type = "minutes";
  } else {
    num = (minutes / 60).toFixed(1);
    type = "hours";
  }

  return num + " " + type;
}

/**
 * Function to generate the number of days in a particular year
 *
 */
export function daysInYear(year: number) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}

/**
 * Function to geenrate the number of days in a particular year
 *
 */
export function generateDatesInYear(year: number): IGridData[] {
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

/**
 * Function to populate dates with user's actual numOfMinutess data
 *
 */
export function generateGridData(
  datesinYearArray: IGridData[],
  tasksInYearArray: ITaskInTheYear[]
) {
  const baseArray = datesinYearArray;
  const dataArray = tasksInYearArray;
  const updatedArray = [];
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

  return updatedArray;
}

/**
 * Function that draws the grids using d3.js
 *
 */
export function drawGrids(
  reference: MutableRefObject<null>,
  data: IGridData[],
  year: number,
  weekStartType: string, // "monday", "sunday"
  cellSize: number,
  tooltipRef: MutableRefObject<null>,
  setMousePos: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
    }>
  >
) {
  // Calculate values
  const dates = d3.map(data, (d) => d.date); // Array of dates
  const minutes = d3.map(data, (d) => d.number_of_minutes); // Array of num_of_minutes
  const indexes = d3.range(dates.length);
  const spaceBetweenGrids = 6;

  const dayOfWeek =
    weekStartType === "sunday" ? (i: number) => i : (i: number) => (i + 6) % 7; // returns [0-6] to correspond to a day of week
  const startOfWeekDate =
    weekStartType === "sunday" ? d3.timeSunday : d3.timeMonday; //
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

  // Clear previous svg
  d3.select(reference.current).select("svg").remove();

  // Create colour scale
  const originalNumOfMinsArray = d3.map(data, (d) => d.number_of_minutes);
  const editedNumOfMinsArray = originalNumOfMinsArray.filter((item) => {
    return item > 0;
  });
  const q1 = d3.quantile(editedNumOfMinsArray, 0.25);
  const q2 = d3.quantile(editedNumOfMinsArray, 0.5);
  const q3 = d3.quantile(editedNumOfMinsArray, 0.75);
  const q4 = d3.quantile(editedNumOfMinsArray, 1);

  function calculateFillColour(date: Date, value: number) {
    const today = formatDate(new Date());

    // Today: yellow
    if (formatDate(date) === today) {
      return "#FCD34D";
    }

    // Other days: shades of blue, depending on num of minutes worked
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
    .attr("width", 54 * (cellSize + spaceBetweenGrids))
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

  // Adding tooltips
  const tooltip = d3
    .select(tooltipRef.current)
    .style("opacity", 0)
    .style("visibility", "hidden");

  const mouseover: { (e: MouseEvent, d: IGridData): void } = (e, d) => {
    // Capture position
    setMousePos({ x: e.clientX, y: e.clientY });

    // Set text in tooltip
    tooltip.html(
      `${convertMinsToHours(d.number_of_minutes)} <br/>${formatDateTooltip(
        d.date
      )}`
    );

    // Make div appear
    tooltip.style("opacity", 1).style("visibility", "visible");
  };

  const mouseleave = () => {
    tooltip.style("opacity", 0).style("visibility", "hidden");
  };

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
    .attr("fill", (d, i) => calculateFillColour(d.date, minutes[i]))
    .style("cursor", "pointer")
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave);
}
