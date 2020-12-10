function _sChart(width, height, data, sankey, tDuration) {
 const svg = d3.select("#sK-wrapper")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const {nodes, links} = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // var startNodes = nodes.filter((d) => {
  //
  //  return d.depth < 2 ? d : null;
  // });
  //
  // var startLinks = links.filter((d) => {
  //   return d.target.depth < 2 ? d: null;
  // });

svg.append("g")
  .selectAll("rect")
  .data(nodes)
  .join("rect")
      .attr("x", d => 0)
      .attr("y", d => d.y1 - ((d.y1 - d.y0)/2))
      .attr("height", 1)
      .attr("width", 0)
      .attr("opacity", 0.7)
      .attr("fill", d => {
        let c;
          for (const link of d.sourceLinks) {
            c = d3.color("#a6bddb").darker(0.3);
        }
        for(const link of d.targetLinks) {
         if (c === undefined) c = d3.color(link.color).darker(0.5);
        }
        return c;
      })
      .transition()
      .duration(tDuration)
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  const link = svg.append("g")
      .attr("fill", "none")
    .selectAll("g")
    .data(links)
    .join("g")
    .attr("stroke", d => d3.color(d.color))
    .attr("stroke-dasharray", d => {return d.target.name === "Damaged" ? "10,1" : null;});

  link.append("path")
    .attr("d", d3.sankeyLinkHorizontal().x(null))
    .attr("stroke-width", 1)
    .attr("opacity", 0.7)
    .transition()
    .duration(tDuration)
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("d", d3.sankeyLinkHorizontal());

  link.append("title")
      .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`);

  svg.append("g")
       .style("font", "2px sans-serif")
      .selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => 0)
        .attr("y", d => d.y1 - ((d.y1 - d.y0)/2))
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .transition()
        .duration(tDuration)
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .style("font-size", "18px")
        .on("end", appendVal());

  function appendVal() {
    svg.selectAll("text")
      .data(nodes)
      .append("tspan")
      .attr("fill-opacity", 0.7)
      .text(d => {
         const parseFloat = d3.format(",.0f");
         let parsed = parseFloat(d.value);

         return ` ${parsed.toLocaleString()}`;
       });
  }

 return svg.node();
}

function _sankey(width, height) {
  return d3.sankey()
    .nodeId(d => d.name)
    .nodeAlign(d3.sankeyJustify)
    .nodeWidth(15)
    .nodePadding(15)
    .extent([[1, 5], [width - 1, height - 50]]);
}

function _parseSData(dataFile) {

  const colors = _sColors();
 const links = d3.csvParseRows(dataFile, ([parentCategory, Item, price]) => ({
    source: parentCategory,
    target: Item,
    value: +[price]
  })).filter((ele) => {
   return ele.source === "Total Estate Value" ? ele : null;
 });

  const nodeByName = new Map;
  for(const link of links) {
     if (!nodeByName.has(link.target)) nodeByName.set(link.target, {name: link.target});
        if (!nodeByName.has(link.source))
          nodeByName.set(link.source, {name: link.source});
    if(!link.color) {
      var linkCategory = link.target;
      var linkColor = d3.color(colors[linkCategory]).brighter(0.2);
      link.color = linkColor;
    }
  }
  return {nodes: Array.from(nodeByName.values()), links};

}

async function _sData(file) {
  return fetch(file).then((response) => {
    return response.text();
  });
}

function _sColors() {
  const colors = {
   "Generic": "#045a8d",
   "Spinning": "#0570b0",
   "Chickens": "#3690c0",
   "Earthen": "#74a9cf",
   "Chamber Pots": "#a6bddb",
   "Laundry": "#d0d1e6",
   "Dairy": "#ece7f2",
   "Brew": "#ffeda0",
   "Household Linens": "#fed976",
   "Textile": "#feb24c",
   "Hunt/War": "#fd8d3c",
   "Bed": "#fc4e2a",
   "Furniture": "#e31a1c",
   "Razor": "#bd0026",
   "Seating": "#bd0026",
   "Cookware": "#e31a1c",
   "Interior Lighting": "#fc4e2a",
   "Tea": "#fd8d3c",
   "Diningware": "#feb24c",
   "Timekeeping": "#fed976",
   "Decorative": "#ffeda0",
   "Cleaning": "#ece7f2",
   "Slaves": "#d0d1e6",
   "Farm Animals": "#a6bddb",
   "Specialized Tool": "#74a9cf",
   "Food": "#3690c0",
   "Alcohol": "#0570b0",
   "Men Clothes": "#0570b0",
   "Silver Plate": "#045a8d",
   "Damaged": "#cdced294"
  }
  return colors;
}

async function initSankey(file) {
  const width = 954;
  const height = 700;
  const tDuration = 2000;
  const data = await _sData(file);
  const parsed = await _parseSData(data);
  const sankey = _sankey(width, height);
  const chart = _sChart(width, height, parsed, sankey, tDuration);
}

function draw1(file) {
  console.log("drawing 1");
  initSankey(file);
}
function draw2(file) {
  console.log("drawing 2");
  d3.select("svg")
    .selectAll("g")
    .lower()

  initSankey(file);
}
