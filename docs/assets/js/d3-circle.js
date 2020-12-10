async function _data() {
  return d3
  .json("/york-county/assets/data/circ.json");
}

const itemTotals =[
  {
    "name": "Spinning",
    "value": 351
  },
  {
    "name": "Chickens",
    "value": 45
  },
  {
    "name": "Earthen",
    "value": 349
  },
  {
    "name": "Chamber Pots",
    "value": 147
  },
  {
    "name": "Sewing",
    "value": 80
  },
  {
    "name": "Laundry",
    "value": 339
  },
  {
    "name": "Dairy",
    "value": 139
  },
  {
    "name": "Brew",
    "value": 19
  },
  {
    "name": "HH linens",
    "value": 468
  },
  {
    "name": "Textile",
    "value": 124
  },
  {
    "name": "Distill",
    "value": 65
  },
  {
    "name": "Razor",
    "value": 140
  },
  {
    "name": "Hunt War",
    "value": 374
  },
  {
    "name": "Men clothes",
    "value": 203
  },
  {
    "name": "Women clothes",
    "value": 56
  },
  {
    "name": "Either clothes",
    "value": 229
  },
  {
    "name": "Both clothes",
    "value": 30
  },
  {
    "name": "Absent",
    "value": 119
  }
];

function processData(data) {
    const newArr = [];
  var deep = data.children[0].children[0].children;
  var children = data.children;
  // console.log(deep);
  // deep.forEach((ele) => {
  //   console.log(ele);
  //   newObj.push(ele);
  // })
  children.forEach((year,j) => {
    var newObj = {};
    // newObj[year.name] = [];
    newObj.name = year.name;
    newObj.children = []
    // console.log(year);

    year.children.forEach((wealth) => {
      // console.log(wealth);
      wealth.children.forEach((item, i) => {
        //console.log("****");
        var itemName = item.name;
        // console.log(name);
        var value = (newObj.children[i]) ? newObj.children[i].value + item.value : item.value;
      // if(newObj[year.name][i]
        newObj.children[i] = {name:itemName, value: value};
        // console.log(newObj[year.name][i]);
        // console.log(item);
        // newObj[j][item.name] += item.value;
      })

    })
  //  console.log("---");
    //console.log(newObj);
    newArr.push(newObj);

  })
     // console.log(newArr);
//for each quarter
  //obj year: [items]
  //for each class
  return newArr;
}

async function initCircles() {
  const dataN = await _data();
  const stepTwoData = processData(dataN);
  console.log("in here")
  const chart = drawCircles(itemTotals, stepTwoData);
}


function drawCircles(newData, real2) {
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
   "Slaves": "#d0d1e6",
   "Farm Animals": "#a6bddb",
   "Specialized Tool": "#74a9cf",
   "Food": "#3690c0",
   "Alcohol": "#0570b0",
   "Silver Plate": "#045a8d"
 };

  const width = 680;
  const height = 680;
 // const nodes = newData.map(d => Object.create(d));
 //  console.log(nodes);

   // const simulation = d3.forceSimulation(nodes)
   //    .force("charge", d3.forceManyBody())
   //    // .force("x", d3.forceX()) //controls axis
   //    .force("y", d3.forceY())
   //    .force("collide", d3.forceCollide(width/28, height/20));

    const svg = d3.select("#chart").append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    // const node = svg.append("g")
    //   .attr("stroke", "#fff")
    //   .attr("stroke-width", 1.5)
    // .selectAll("circle")
    // .data(nodes)
    // .join("circle")
    //   .attr("r", d => d.value/8)
    //   .attr("opacity", 0.5)
    //   .attr("fill", d => colors[d.name]);

    // node.append("title")
    //   .text(d => {
    //   console.log(d.name);
    //   return d.name;
    // });

    //  const label = svg.append("g")
    //   .style("font", "12px sans-serif")
    //   // .attr("text-anchor", "middle")
    // .selectAll("text")
    // .data(nodes)
    // .join("text")
    //   .text(d => d.name + d.value)
    //   .attr("opacity", 0.7)
    //   .attr("x", d => d.x * 8)
    //   .attr("y", d => d.y * 2);//valid text

  //   simulation.on("tick", () => {
  //   // link
  //   //     .attr("x1", d => d.source.x)
  //   //     .attr("y1", d => d.source.y)
  //   //     .attr("x2", d => d.target.x)
  //   //     .attr("y2", d => d.target.y);
  //
  //   node
  //       .attr("cx", d => d.x)
  //       .attr("cy", d => d.y);
  // });

  // svg.on("click", () => {
  //        svg.selectAll('circle')
  //       .transition().duration(1000)
  //       .attr('r', d => d.value/16)
  //       .attr('opacity', "0")
  //       .attr("cx", 0)
  //       .attr("cy", 0);
  //     });
  //       .lower();

  // svg.on("click", stepTwo);

        // .remove();
        // stepTwo();
        // .on("end", (d) => {
        //    endall(d)
        //  });
        // .remove()
//         .call(endall, function() {
// console.log("all done"); });

    // stepTwo();
  // }, (d) => stepTwo())

  // svg.on("toggle", stepTwo())
   var n = 0;
function endall(transition) {
//console.log(transition.empty());
  console.log(n);
  if(n >= 17) {
    stepTwo();

  }
  n++;
  // transition
  //   .each(function() { console.log(n), ++n; })
  //   .each("end", function() { if (!--n) callback.apply(this, arguments);});
}

//And then, rather than each("end", callback), say call(endall, callback):

// d3.selectAll("g").transition().call(endall, function() {
// console.log("all done"); });

  // function stepTwo() {
      const positioning = [{"x": -100, "y": -100}, {"x": -100, "y": 100},{"x": 100, "y": -100},{"x": 100, "y": 100}];

  real2.forEach((year, i) => {
    // const svg = d3.select("svg").append("g")
    var m = i*10;
    var n = i*2;
   const nodes = year.children.map(d => Object.create(d));

    // console.log(nodes);

   const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX(d => positioning[i].x)) //controls axis
      .force("y", d3.forceY(d => positioning[i].y))
      .force("collide", d3.forceCollide((width/40), (height/40)));



    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr('r', d => d.value/16)
      .attr('opacity', "0.1")
      .attr("cx", 0)
      .attr("cy", 0)
       .transition().duration(2000).delay(3000)
       .attr("r", d => d.value/5)
       .attr("opacity", 0.5)
      .attr("fill", d => {
        var c = colors[d.name];
        // console.log(d.name + c)
        return c;
      });

    // node.append("text")
    //   .text(d => {
    //   console.log(d.name);
    //   return d.name;
    // });

   const label = svg.append("g")
      .style("font", "16px sans-serif")
      // .attr("text-anchor", "middle")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .text((d, j) => {return j < 1 ? year.name : null})
      .attr("x", d => positioning[i].x)
      .attr("y", d => positioning[i].y + 50)
      .attr("opacity", 0)
      .transition().duration(2000).delay(3000)
      .attr("opacity", 1);





    simulation.on("tick", () => {
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });
  // return svg.node();
  })

  // }


  // invalidation.then(() => simulation.stop());

  return svg.node();
}











//chart
/*function _chart(data, width, height, pack, color, format) {
  const root = pack;
  let focus = root;
  let view;

  const svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("background", color(0))
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, root));

  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("pointer-events", d => !d.children ? "none" : null)
      .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
      .on("mouseout", function() { d3.select(this).attr("stroke", null); })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

  const label = svg.append("g")
      .style("font", "8px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "inline")
      .text(d => d.data.name);

  zoomTo([root.x, root.y, root.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
  }

  function zoom(event, d) {
    const focus0 = focus;

    focus = d;

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  /*d3.select("#circ")
    .on("click", function(event) {
      console.log("loaded");
      var mEvent = event;
      //svg.dispatch("click", (mEvent) => {
              console.log(mEvent);
        svg.dispatch(zoom(mEvent, root.children[2])); //this works, styling sux tho
      // });
    })*/
/*
  return svg.node();
}


//pack
function _pack(data, width, height) {
   return d3.pack()
    .size([width, height])
    .padding(3)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value));
}


function _format() {
  return d3.format(",d");
}

function _color() {
  return d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);
}
//data
/*const _data = ;*/

// async function _data() {
//   return d3
//   .json("/york-county/assets/data/circ.json");
// }

/*async function main() {
  const height = 600;
  const width = 600;
  const color = _color();
  const format = _format();
  const data = await _data();
  const pack = _pack(data, width, height);
  const chart = _chart(data, width, height, pack, color, format);
}*/
