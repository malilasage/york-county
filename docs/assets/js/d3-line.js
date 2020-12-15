

async function _initLine(file) {
  const height = 700;
  const width = 954;
  const margin = ({top: 20, right: 20, bottom: 30, left: 30});



  const parsed = await _lineFile(file);
  const data = await _lineData(parsed);
  // const x = x(data, margin, width);
  // const y = _y(data, margin, height);
  // const line = _line(x, y, data);
  // const xAxis = _xAxis(margin, height, x);
  // const yAxis = _yAxis(data, y, margin);
  // const xAxis = _xAxis;
  // const yAxis = _yAxis;
  // const x = _x;
  const lineChart = _lineChart(height, width, margin, data);
}

function _lineChart(height, width, margin, data) {
  const colors = {
   "Generic": "purple",
   "Spinning": "#0570b0",
   "Chickens": "#3690c0",
   "Earthen": "#74a9cf",
   "Chamber Pots": "#a6bddb",
   "Laundry": "#d0d1e6",
   "Dairy": "#ece7f2",
   "Brew": "#ffeda0",
   "HH Linens": "#fed976",
    "Distill" : "#bd0026",
   "Textile": "#feb24c",
   "Hunt War": "#bd0026",
   "Bed": "#fc4e2a",
    "Sewing": "#e31a1c",
   "Furniture": "#e31a1c",
   "Seating": "#bd0026",
   "Cookware": "#e31a1c",
   "Women Clothes": "#fc4e2a",
   "Men clothes": "#fd8d3c",
   "Razor": "#feb24c",
   "Timekeeping": "#fed976",
   "Decorative": "#ffeda0",
   "Cleaning": "#ece7f2",
   "Bonded": "black",
   "Farm Animals": "#a6bddb",
   "Specialized Tool": "#74a9cf",
   "Food": "#3690c0",
   "Alcohol": "#0570b0",
   "Silver Plate": "#045a8d"
 };

 const x = d3.scaleUtc()
   .domain(d3.extent(data.dates))
   .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
    .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const yAxis = g => g.attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

    const line = d3.line()
    // .interpolate("basis")
    .curve(d3.curveBasis)
    .x((d, i) => x(data.dates[i]))
    .y(d => y(d))

   const svg = d3.select("#timeline-wrapper").append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible");

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
    .selectAll("path")
    .data(data.series)
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("stroke", d => colors[d.name])
      .attr("opacity", d => {
        if((d.name === "Bonded") || (d.name === "Spinning")) {
          return 1;
        } else {return 0.3;}
      })
      .attr("d", d => line(d.values))
      .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attrTween("stroke-dasharray", function() {
      const length = this.getTotalLength();
      return d3.interpolate(`0,${length}`, `${length},${length}`);
    });

  svg.call(hover, path);



  function _y(data, margin, height){
    return d3.scaleLinear()
      .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
      .range([height - margin.bottom, margin.top]);
  }

function hover(svg, path) {

  if ("ontouchstart" in document) svg
      .style("-webkit-tap-highlight-color", "transparent")
      .on("touchmove", moved)
      .on("touchstart", entered)
      .on("touchend", left)
  else svg
      .on("mousemove", moved)
      .on("mouseenter", entered)
      .on("mouseleave", left);

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function moved(event) {
    event.preventDefault();
    const pointer = d3.pointer(event, this);
    const xm = x.invert(pointer[0]);
    const ym = y.invert(pointer[1]);
    const i = d3.bisectCenter(data.dates, xm);
    const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
    // path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
    dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
    dot.select("text").text(s.name);
  }

  function entered() {
    // path.style("mix-blend-mode", null).attr("stroke", "#ddd");
    dot.attr("display", null);
  }

  function left() {
    // path.style("mix-blend-mode", "multiply").attr("stroke", null);
    dot.attr("display", "none");
  }
}


  return svg.node();
}

  function _x() {
    return d3.scaleUtc()
      .domain(d3.extent(data.dates))
      .range([margin.left, width - margin.right]);
  }

async function _lineData(file) {

  const data = d3.tsvParse(file);
  const columns = data.columns.slice(1);

  return {
    y: "Item Categories",
    series: data.map(d => ({
      name: d.name.replace(/, ([\w-]+).*/, " $1"),
      values: columns.map(k => +d[k])
    })),
    dates: columns.map(d3.utcParse("%Y"))
  };
}

async function _lineFile(file) {
  return fetch(file).then((response) => {
    return response.text();
  });
}
