import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");

let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));

const margin = { top: 25, right: 20, bottom: 60, left: 70 };

// parsing & formatting
const formatXAxis = d3.format("~s");

// scale
const xScale = d3.scaleLog().range([margin.left, width - margin.right]);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
const radiusScale = d3.scaleSqrt().range([0, 55]);
const colorScale = d3
  .scaleOrdinal()
  .range(["#8160C8", "#FFA602", "#CDC0E4", "#cfcfcf"]);
// axis
const xAxis = d3
  .axisBottom(xScale)
  .tickFormat((d) => formatXAxis(d))
  .tickValues([500, 1000, 2000, 4000, 8000, 16000, 32000, 64000]);

const yAxis = d3.axisLeft(yScale).ticks(5);

const tooltip = d3
  .select("#svg-container")
  .append("div")
  .attr("class", "tooltip");
// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
// data
let data = [];
let region;
let circles;
let xUnit;
let yUnit;
let legendRects;
let legendTexts;
let asiaSelected = false;
let chinaSelected = false;
let usSelected = false;
let europeSelected = false;
let africaSelected = false;

d3.csv("data/gapminder_combined.csv")
  .then((raw_data) => {
    data = raw_data.map((d) => {
      d.population = parseInt(d.population);
      d.income = parseInt(d.income);
      d.year = parseInt(d.year);
      d.life_expectancy = parseInt(d.life_expectancy);
      return d;
    });
    //   console.log(raw_data);

    region = [...new Set(data.map((d) => d.region))];
    console.log(region);
    // xScale.domain(d3.extent(data, (d) => d.income));
    xScale.domain([500, d3.max(data, (d) => d.income)]);
    yScale.domain(d3.extent(data, (d) => d.life_expectancy));
    radiusScale.domain([0, d3.max(data, (d) => d.population)]);
    colorScale.domain(region);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    circles = svg
      .selectAll("circles")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.income))
      .attr("cy", (d) => yScale(d.life_expectancy))
      .attr("r", (d) => radiusScale(d.population))
      .attr("fill", (d) => colorScale(d.region))
      .attr("stroke", "#fff");
    // .on("mousemove", function (event, d, index) {
    //   tooltip
    //     .style("left", event.pageX + "px")
    //     .style("top", event.pageY - 120 + "px")
    //     .style("display", "block")
    //     .style("background-color", "rgba(255, 255, 255, 0.9")
    //     .style("border", "1px solid black")
    //     .html(
    //       `<div>${d.country} <span class = "test" style= "font-size:12px;"> <br/>Life expectancy: <br/><span style="font-size:20px;">${d.life_expectancy}`
    //     );

    //   d3.select(this).style("stroke-width", 3).attr("stroke", "#111");
    // })
    // .on("mouseout", function () {
    //   tooltip.style("display", "none");
    //   d3.select(this).style("stroke-width", 1).attr("stroke", "#fff");
    // });

    // Units
    xUnit = svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height - 10})`)
      .text("GDP per capita")
      .attr("class", "unit");

    yUnit = svg
      .append("text")
      .attr("transform", "translate(20," + height / 2 + ") rotate(-90)")
      .text("Life expectancy")
      .attr("class", "unit");

    // Legend
    legendRects = svg
      .selectAll("legend-rects")
      .data(region)
      .enter()
      .append("rect")
      .attr("x", (d, i) => width - margin.right - 83)
      .attr("y", (d, i) => height - margin.bottom - 70 - 25 * i)
      .attr("width", 12)
      .attr("height", 17)
      .attr("fill", (d) => colorScale(d));

    legendTexts = svg
      .selectAll("legend-texts")
      .data(region)
      .enter()
      .append("text")
      .attr("x", (d, i) => width - margin.right - 83 + 20)
      .attr("y", (d, i) => height - margin.bottom - 70 - 25 * i + 15)
      .text((d) => d)
      .attr("class", "legend-texts");

    //Button Asia
    d3.select("#button-asia").on("click", () => {
      asiaSelected = !asiaSelected;
      chinaSelected = false;
      usSelected = false;
      europeSelected = false;
      africaSelected = false;

      d3.select("#text-desc").text("Asia Selected");
      d3.select("#button-asia").classed("button-clicked", asiaSelected);
      d3.select("#button-china").classed("button-clicked", false);
      d3.select("#button-us").classed("button-clicked", false);
      d3.select("#button-europe").classed("button-clicked", false);
      d3.select("#button-africa").classed("button-clicked", false);

      circles.attr("fill", (d) => {
        if (asiaSelected) {
          return d.region == "asia" ? colorScale(d.region) : "rgba(0,0,0,0.1)";
        } else {
          return colorScale(d.region);
        }
      });
    });
    // Button China
    d3.select("#button-china").on("click", () => {
      chinaSelected = !chinaSelected;
      asiaSelected = false;
      usSelected = false;
      europeSelected = false;
      africaSelected = false;

      d3.select("#text-desc").text("China Selected");
      d3.select("#button-china").classed("button-clicked", chinaSelected);
      d3.select("#button-asia").classed("button-clicked", false);
      d3.select("#button-us").classed("button-clicked", false);
      d3.select("#button-europe").classed("button-clicked", false);
      d3.select("#button-africa").classed("button-clicked", false);

      circles.attr("fill", (d) => {
        if (chinaSelected) {
          return d.country == "China"
            ? colorScale(d.region)
            : "rgba(0,0,0,0.1)";
        } else {
          return colorScale(d.region);
        }
      });
    });

    // Button US
    d3.select("#button-us").on("click", () => {
      usSelected = !usSelected;
      asiaSelected = false;
      chinaSelected = false;
      europeSelected = false;
      africaSelected = false;

      d3.select("#text-desc").text("US Selected");
      d3.select("#button-us").classed("button-clicked", usSelected);
      d3.select("#button-asia").classed("button-clicked", false);
      d3.select("#button-china").classed("button-clicked", false);
      d3.select("#button-europe").classed("button-clicked", false);
      d3.select("#button-africa").classed("button-clicked", false);

      circles.attr("fill", (d) => {
        if (usSelected) {
          return d.country == "United States"
            ? colorScale(d.region)
            : "rgba(0,0,0,0.1)";
        } else {
          return colorScale(d.region);
        }
      });
    });
    // Button Europe
    d3.select("#button-europe").on("click", () => {
      europeSelected = !europeSelected;
      asiaSelected = false;
      chinaSelected = false;
      usSelected = false;
      africaSelected = false;

      d3.select("#text-desc").text("Europe Selected");
      d3.select("#button-europe").classed("button-clicked", europeSelected);
      d3.select("#button-asia").classed("button-clicked", false);
      d3.select("#button-china").classed("button-clicked", false);
      d3.select("#button-us").classed("button-clicked", false);
      d3.select("#button-africa").classed("button-clicked", false);

      circles.attr("fill", (d) => {
        if (europeSelected) {
          return d.region == "europe"
            ? colorScale(d.region)
            : "rgba(0,0,0,0.1)";
        } else {
          return colorScale(d.region);
        }
      });
    });
    // Button Africa
    d3.select("#button-africa").on("click", () => {
      africaSelected = !africaSelected;
      asiaSelected = false;
      chinaSelected = false;
      usSelected = false;
      europeSelected = false;

      d3.select("#text-desc").text("Africa Selected");
      d3.select("#button-africa").classed("button-clicked", africaSelected);
      d3.select("#button-asia").classed("button-clicked", false);
      d3.select("#button-china").classed("button-clicked", false);
      d3.select("#button-us").classed("button-clicked", false);
      d3.select("#button-europe").classed("button-clicked", false);

      circles.attr("fill", (d) => {
        if (africaSelected) {
          return d.region == "africa"
            ? colorScale(d.region)
            : "rgba(0,0,0,0.1)";
        } else {
          return colorScale(d.region);
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error loading CSV data: ", error);
  });

////////////////////////////  Resize  //////////////////////////////
window.addEventListener("resize", () => {
  //  width, height updated
  width = parseInt(d3.select("#svg-container").style("width"));
  height = parseInt(d3.select("#svg-container").style("height"));

  //  scale updated
  xScale.range([margin.left, width - margin.right]);
  yScale.range([height - margin.bottom, margin.top]);

  //  axis updated
  d3.select(".x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  d3.select(".y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // circles updated
  circles
    .attr("cx", (d) => xScale(d.income))
    .attr("cy", (d) => yScale(d.life_expectancy))
    .attr("r", (d) => radiusScale(d.population));

  // units updated
  xUnit.attr("transform", `translate(${width / 2}, ${height - 10})`);
  yUnit.attr("transform", "translate(20," + height / 2 + ") rotate(-90)");

  //  legend updated
  legendRects
    .attr("x", (d, i) => width - margin.right - 83)
    .attr("y", (d, i) => height - margin.bottom - 70 - 25 * i);

  legendTexts
    .attr("x", (d, i) => width - margin.right - 83 + 20)
    .attr("y", (d, i) => height - margin.bottom - 70 - 25 * i + 15);
});
