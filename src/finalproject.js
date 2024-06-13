import * as d3 from "d3";
import "./main.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");

let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));

const margin = { top: 20, right: 50, bottom: 30, left: 100 };

// // parsing & formatting
// // const formatXAxis = d3.format("~s");
// data
let button2020Selected = false;
let button2021Selected = false;
let button2022Selected = false;
let xUnit;
let yUnit;
let data = [];
let bars;
let x;
let y;
let xAxis;
let yAxis;
let currentStep = 2020;

d3.csv("data/tripdata.csv").then((raw_data) => {
  data = raw_data.map((d) => {
    return {
      region: d.region,
      updown2020: parseFloat(d.updown2020),
      updown2021: parseFloat(d.updown2021),
      updown2022: parseFloat(d.updown2022),
    };
  });
  console.log(raw_data);

  // scale

  x = d3
    .scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([-100, 100]);
  y = d3
    .scaleBand()
    .domain(data.map((d) => d.region))
    .range([margin.top, height - margin.bottom])
    .padding(0.1);
  // .range([0, margin.top])
  // axis
  xAxis = d3
    .axisBottom(x)
    .tickValues(d3.range(-100, 101, 25))
    .tickSizeOuter(0)
    .tickSize(-height + 40);

  yAxis = d3.axisLeft().scale(y).ticks(17).tickSize(0);

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

  const tooltip = d3
    .select("#svg-container")
    .append("div")
    .attr("class", "tooltip");
  // // svg elements
  d3.select("#text-desc").text(
    "<2020년 기준> 전년도 대비 국내 숙박여행 증감률"
  );

  bars = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => (d.updown2020 > 0 ? x(0) : x(d.updown2020))) // 막대의 시작 위치
    .attr("y", (d) => y(d.region)) // 막대의 세로 위치 (지역에 따라 스케일된 값)

    .attr("width", (d) =>
      d.updown2020 > 0 ? x(d.updown2020) - x(0) : x(0) - x(d.updown2020)
    )

    .attr("height", y.bandwidth())
    .attr("fill", (d) =>
      d.updown2020 > 0 ? "rgba(0, 0, 139, 0.5)" : "rgba(139, 0, 0, 0.5)"
    )

    .on("mouseover", function (event, d) {
      let tooltipText;

      if (currentStep === 2020) {
        tooltipText = `${d.region}: ${d.updown2020}%`;
      } else if (currentStep === 2021) {
        tooltipText = `${d.region}: ${d.updown2021}%`;
      } else if (currentStep === 2022) {
        tooltipText = `${d.region}: ${d.updown2022}%`;
      }

      tooltip
        .style("left", event.pageX + 40 + "px")
        .style("top", event.pageY - 100 + "px")
        .style("display", "block")
        .html(tooltipText);

      d3.select(this)
        .style("stroke-width", 3)
        .attr("stroke", "rgba(255, 255, 255, 0.6)");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this).style("stroke-width", 0).attr("stroke", "none");
    });

  d3.select("#annotation").html("").style("left", "1000%");

  ////////////////////////////////////////////////////////////////////
  ////////////////////////////  Load CSV  ////////////////////////////
});

// Units
xUnit = svg
  .append("text")
  .attr("transform", `translate(${width - 30}, ${height - 15})`)
  .text("(%)")
  .attr("class", "unit");

yUnit = svg
  .append("text")
  .attr("transform", "translate(10,15)")
  .text("(행정구역 시)")
  .attr("class", "unit");

//Button 2020
d3.select("#button-2020").on("click", () => {
  button2020Selected = !button2020Selected;
  button2021Selected = false;
  button2022Selected = false;

  currentStep = 2020;

  d3.select("#text-desc").text(
    "<2020년 기준> 전년도 대비 국내 숙박여행 증감률"
  );
  d3.select("#button-2020").classed("button-clicked", button2020Selected);
  d3.select("#button-2021").classed("button-clicked", false);
  d3.select("#button-2022").classed("button-clicked", false);

  bars
    .transition()
    .duration(800)
    .attr("x", (d) => (d.updown2020 > 0 ? x(0) : x(d.updown2020)))
    .attr("fill", (d) => {
      if (d.updown2020 > 0) {
        return "rgba(0, 0, 139, 0.5)"; // darkblue with 60% opacity
      } else if (d.updown2020 <= -52) {
        return "darkred"; // darkred without opacity for emphasis
      } else {
        return "rgba(139, 0, 0, 0.5)"; // darkred with 60% opacity
      }
    })
    .attr("width", (d) =>
      d.updown2020 > 0 ? x(d.updown2020) - x(0) : x(0) - x(d.updown2020)
    );
  if (currentStep == 2020) {
    d3.select("#annotation")
      .html(
        "<b>1. 대구·경북 지역:</b> 종교단체 집단감염 확산 <br><br> <b>2. 서울, 부산, 인천:</b> 인구 밀도 높은 대도시  <br><br> <b>전체적 양상:</b> 코로나로 인해 전국 관광 및 숙박여행 횟수 감소"
      )
      .style("left", "60%")
      .style("top", "10%");
  } else {
    d3.select("#annotation").style("display", "none");
  }
});

//Button 2021
d3.select("#button-2021").on("click", () => {
  button2021Selected = !button2021Selected;
  button2020Selected = false;
  button2022Selected = false;

  currentStep = 2021;

  d3.select("#text-desc").text(
    "<2021년 기준> 전년도 대비 국내 숙박여행 증감률"
  );
  d3.select("#button-2021").classed("button-clicked", button2021Selected);
  d3.select("#button-2020").classed("button-clicked", false);
  d3.select("#button-2022").classed("button-clicked", false);

  bars
    .transition()
    .duration(800)
    .attr("x", (d) => (d.updown2021 > 0 ? x(0) : x(d.updown2021)))
    .attr("fill", (d) => {
      if (d.updown2021 <= -49) {
        return "darkred";
      } else if (d.updown2021 >= 27) {
        return "darkblue";
      } else {
        return d.updown2021 > 0
          ? "rgba(0, 0, 139, 0.5)"
          : "rgba(139, 0, 0, 0.5)";
      }
    })
    .attr("width", (d) =>
      d.updown2021 > 0 ? x(d.updown2021) - x(0) : x(0) - x(d.updown2021)
    );
  if (currentStep == 2021) {
    d3.select("#annotation")
      .html(
        "<b>1. (-) 세종시:</b> 관광도시의 이미지 부족 (신도시, 행정중심복합도시) <br><br> <b>2. (+) 제주:</b> 해외 여행이 어려워지면서 대체 여행지로 급부상  <br><br> <b>전체적 양상:</b> 코로나 백신 도입으로 국내 숙박여행 횟수 서서히 증가"
      )
      .style("left", "60%")
      .style("top", "40%");
  } else {
    d3.select("#annotation").style("display", "none");
  }
});

//Button 2022
d3.select("#button-2022").on("click", () => {
  button2022Selected = !button2022Selected;
  button2020Selected = false;
  button2021Selected = false;

  currentStep = 2022;

  d3.select("#text-desc").text(
    "<2022년 기준> 전년도 대비 국내 숙박여행 증감률"
  );
  d3.select("#button-2022").classed("button-clicked", button2022Selected);
  d3.select("#button-2021").classed("button-clicked", false);
  d3.select("#button-2020").classed("button-clicked", false);

  bars
    .transition()
    .duration(800)
    .attr("x", (d) => (d.updown2022 > 0 ? x(0) : x(d.updown2022)))
    .attr("fill", (d) =>
      d.updown2022 > 100
        ? "darkblue"
        : d.updown2022 > 0
        ? "rgba(0, 0, 139, 0.5)"
        : "rgba(139, 0, 0, 0.5)"
    )
    .attr("width", (d) =>
      d.updown2022 > 0 ? x(d.updown2022) - x(0) : x(0) - x(d.updown2022)
    );
  if (currentStep == 2022) {
    d3.select("#annotation")
      .html(
        "<b>(++) 세종시:</b> 국립세종수목원, 국내 유일 금강보행교 등 다양한 관광지와 더불어 활발한 SNS 홍보로 급격한 증가율 자랑 <br><br> <b>전체적 양상:</b> 코로나 재유행 상황에서도 상황이 많이 악화되지 않고 안정적인 추세를 보이며 숙박여행 횟수 전국적으로 증가"
      )
      .style("left", "15%")
      .style("right", "60%")
      .style("top", "20%")
      .style("width", "30%");
  } else {
    d3.select("#annotation").style("display", "none");
  }
});

////////////////////////////  Resize  //////////////////////////////
window.addEventListener("resize", () => {
  //  width, height updated
  width = parseInt(d3.select("#svg-container").style("width"));
  height = parseInt(d3.select("#svg-container").style("height"));

  //  scale updated
  x.range([margin.left, width - margin.right]);
  y.range([margin.top, height - margin.bottom]);

  //  axis updated
  d3.select(".x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  d3.select(".y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // 2020bars updated
  if (currentStep == 2020)
    bars
      .attr("x", (d) => (d.updown2020 > 0 ? x(0) : x(d.updown2020)))
      .attr("y", (d) => y(d.region))
      .attr("width", (d) =>
        d.updown2020 > 0 ? x(d.updown2020) - x(0) : x(0) - x(d.updown2020)
      );
  // 2021bars updated
  if (currentStep == 2021)
    bars
      .attr("x", (d) => (d.updown2021 > 0 ? x(0) : x(d.updown2021)))
      .attr("y", (d) => y(d.region))
      .attr("width", (d) =>
        d.updown2021 > 0 ? x(d.updown2021) - x(0) : x(0) - x(d.updown2021)
      );
  // 2022bars updated
  if (currentStep == 2022)
    bars
      .attr("x", (d) => (d.updown2022 > 0 ? x(0) : x(d.updown2022)))
      .attr("y", (d) => y(d.region))
      .attr("width", (d) =>
        d.updown2022 > 0 ? x(d.updown2022) - x(0) : x(0) - x(d.updown2022)
      );

  // units updated
  xUnit.attr("transform", `translate(${width - 30}, ${height - 15})`);
  yUnit.attr("transform", "translate(10,15)");
});
