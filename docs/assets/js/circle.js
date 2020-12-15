function initCircles() {
  console.log("1. initializing");
    const width = 680;
    const height = 450;
    const svg = d3.select("#chart").append("svg")
      .attr("viewBox", [-width/2, -height/2, width, height]);
  const chart = drawCircles(svg);
}

function drawCircles(svg) {
  console.log("4. drawing circles");
  const width = 680;
  const height = 450;
  const nodes = stepOneData.map(d => Object.create(d));
  // console.log(nodes);

  // const svg = d3.select("#chart").append("svg")
  //   .attr("viewBox", [-width/2, -height/2, width, height]);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .transition().duration(2000)
      .attr("r", d => d.value/10)
      .attr("cx", (d,i) => { return i<9 ? -300 + 70*i: -300 + 70*(i-9)})
      .attr("cy", (d,i) => { return i<9 ? 50 : -50})
      .attr("opacity", 0.5)
      .attr("fill", d => colors[d.name]);
  // function hello() {
  //   console.log("hey");
  // }

  // svg.on("click", () => {
  //        svg.selectAll('circle')
  //       .transition().duration(2000)
  //       .attr('r', d => d.value/16)
  //       .attr('opacity', "0")
  //       .attr("cx", 0)
  //       .attr("cy", 0)
  //       .remove();
  // })

  // function update() {
  //   console.log("layout");
  //
  //      svg.selectAll('circle')
  //       .transition().duration(2000)
  //       .attr('r', d => d.value/16)
  //       .attr('opacity', "0")
  //       .attr("cx", 0)
  //       .attr("cy", 0);
  //       // .remove();
  // }

  // return Object.assign(svg.node(), {update});
  return svg.node();
}

function drawForce(svg) {
  console.log("drawing force");
  const width = 680;
  const height = 450;

  // const svg = d3.create("svg")
    // .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const positioning = [{"x": -150, "y": -100},{"x": 150, "y": -100},{"x": -150, "y": 100},{"x": 150, "y": 100}];

  stepTwoData.forEach((year, i) => {
   const nodes = year.children.map(d => Object.create(d));
    console.log(d3.median(year.children, d => d.value)); //5, 40, 200


   const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      // .transition().duration(2000)
      .attr("r", d => d.value/4)
      .attr("opacity", 0.5)
      .attr("fill", d => colors[d.name]);

     const simulation = d3.forceSimulation(nodes)
      // .velocityDecay(0.1)
      // .friction(0.2)
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX(d => positioning[i].x)) //controls axis
      .force("y", d3.forceY(d => positioning[i].y))
      .force("collide", d3.forceCollide(d => d.value/4));

   const label = svg.append("g")
      .style("font", "12px sans-serif")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .text((d,i) => {return i < 1 ? year.name : null})
      .attr("x", d => positioning[i].x)
      .attr("y", d => positioning[i].y + 75);

    simulation.on("tick", () => {
       node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
   });


  })
    return svg.node();

}

function legend() {
const svg = d3.select("#legend").append("svg").attr("viewBox", [0, 0, 100, 18]);
 const keys = Object.keys(colors);

 // const sizeScale = d3.scaleLinear(d3.extent(legendData, d => d.Median), [5, 35]);
  const sizeScale = [{"value": 20},{"value": 150},{"value": 475}];
  const sizeScaleTwo = [{"value": 5},{"value": 40},{"value": 200}]; //5, 40, 200
  // console.log(d3.extent(legendData, d => d.value));
  // console.log(d3.median(legendData, d => d.value));

 function position(i) {
  return i < 5 ? 1 : i < 10 ? 20 : 35;
 }
  function positionY(i) {
    return i < 5 ? i : i < 10 ? i-5 : i-10;
 }

 svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", (d, i) => {return position(i)})
    .attr("cy", function(d,i){ return 1 + positionY(i)*3}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 0.5)
    .attr("opacity", 0.5)
    .style("fill", function(d){ return colors[d]})

  svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .style("font-size", "1.5px")
    .attr("x", (d, i) => {return position(i) + 2})
    .attr("y", function(d,i){ return 1 + positionY(i)*3}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return colors[d]})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

  // svg.selectAll("sizedots")//this rlly only works for step one
  //   .data(sizeScale)
  //   .enter()
  //   .append("circle")
  //     // .filter((d, i) => {return i%2 === 0 ? d : null})
  //     .attr("cx", d => 60)
  //     .attr("cy", (d, i) => {return i < 2 ? 1 + i*3 : 11})
  //     .attr("r", d => d.value/100)
  //     .style("stroke", "gray")
  //     .style("stroke-width", "0.1px")
  //     .style("fill", "#a6bddb");

 // svg.selectAll("sizelabels")
 //  .data(sizeScale)
 //  .enter()
 //  .append("text")
 //    // .filter((d) => {return d.value > 50})
 //    .style("font-size", "2px")
 //    .attr("x", 67)
 //    .attr("y", function(d,i){return i < 2 ? 1 + i*4 : 11}) // 100 is where the first dot appears. 25 is the distance between dots
 //    .style("fill", "gray")
 //    .text(function(d){ return d.value})
 //    .attr("text-anchor", "left")
 //    .style("alignment-baseline", "middle")



   svg.selectAll("sizedots")//this rlly only works for step one
    .data(sizeScaleTwo)
    .enter()
    .append("circle")
      // .filter((d, i) => {return i%2 === 0 ? d : null})
      .attr("cx", d => 60)
      .attr("cy", (d, i) => {return i < 2 ? 1 + i*3 : 11})
      .attr("r", d => d.value/50)
      .style("stroke", "gray")
      .style("stroke-width", "0.1px")
      .style("fill", "#a6bddb");

 svg.selectAll("sizelabels")
  .data(sizeScaleTwo)
  .enter()
  .append("text")
    // .filter((d) => {return d.value > 50})
    .style("font-size", "1.5px")
    .attr("x", 67)
    .attr("y", function(d,i){return i < 2 ? 1 + i*4 : 11}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "gray")
    .text(function(d){ return d.value})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

 return svg.node();
}

const stepTwoData = [
  {
    "name": "1700-1725",
    "children": [
      {
        "name": "Spinning",
        "value": 34
      },
      {
        "name": "Chickens",
        "value": 4
      },
      {
        "name": "Earthen",
        "value": 62
      },
      {
        "name": "Chamber Pots",
        "value": 31
      },
      {
        "name": "Sewing",
        "value": 23
      },
      {
        "name": "Laundry",
        "value": 43
      },
      {
        "name": "Dairy",
        "value": 18
      },
      {
        "name": "Brew",
        "value": 3
      },
      {
        "name": "HH linens",
        "value": 86
      },
      {
        "name": "Textile",
        "value": 33
      },
      {
        "name": "Distill",
        "value": 14
      },
      {
        "name": "Razor",
        "value": 22
      },
      {
        "name": "Hunt War",
        "value": 64
      },
      {
        "name": "Men Clothes",
        "value": 54
      },
      {
        "name": "Women Clothes",
        "value": 20
      }
    ]
  },
  {
    "name": "1726-1750",
    "children": [
      {
        "name": "Spinning",
        "value": 65
      },
      {
        "name": "Chickens",
        "value": 7
      },
      {
        "name": "Earthen",
        "value": 78
      },
      {
        "name": "Chamber Pots",
        "value": 32
      },
      {
        "name": "Sewing",
        "value": 22
      },
      {
        "name": "Laundry",
        "value": 70
      },
      {
        "name": "Dairy",
        "value": 28
      },
      {
        "name": "Brew",
        "value": 5
      },
      {
        "name": "HH linens",
        "value": 105
      },
      {
        "name": "Textile",
        "value": 25
      },
      {
        "name": "Distill",
        "value": 20
      },
      {
        "name": "Razor",
        "value": 30
      },
      {
        "name": "Hunt War",
        "value": 83
      },
      {
        "name": "Men Clothes",
        "value": 59
      },
      {
        "name": "Women Clothes",
        "value": 17
      }
    ]
  },
  {
    "name": "1751-1775",
    "children": [
      {
        "name": "Spinning",
        "value": 167
      },
      {
        "name": "Chickens",
        "value": 24
      },
      {
        "name": "Earthen",
        "value": 152
      },
      {
        "name": "Chamber Pots",
        "value": 62
      },
      {
        "name": "Sewing",
        "value": 17
      },
      {
        "name": "Laundry",
        "value": 155
      },
      {
        "name": "Dairy",
        "value": 54
      },
      {
        "name": "Brew",
        "value": 8
      },
      {
        "name": "HH linens",
        "value": 209
      },
      {
        "name": "Textile",
        "value": 46
      },
      {
        "name": "Distill",
        "value": 24
      },
      {
        "name": "Razor",
        "value": 60
      },
      {
        "name": "Hunt War",
        "value": 163
      },
      {
        "name": "Men Clothes",
        "value": 69
      },
      {
        "name": "Women Clothes",
        "value": 10
      }
    ]
  },
  {
    "name": "1776-1800",
    "children": [
      {
        "name": "Spinning",
        "value": 72
      },
      {
        "name": "Chickens",
        "value": 10
      },
      {
        "name": "Earthen",
        "value": 45
      },
      {
        "name": "Chamber Pots",
        "value": 15
      },
      {
        "name": "Sewing",
        "value": 13
      },
      {
        "name": "Laundry",
        "value": 57
      },
      {
        "name": "Dairy",
        "value": 33
      },
      {
        "name": "Brew",
        "value": 3
      },
      {
        "name": "HH linens",
        "value": 55
      },
      {
        "name": "Textile",
        "value": 17
      },
      {
        "name": "Distill",
        "value": 6
      },
      {
        "name": "Razor",
        "value": 24
      },
      {
        "name": "Hunt War",
        "value": 52
      },
      {
        "name": "Men Clothes",
        "value": 15
      },
      {
        "name": "Women Clothes",
        "value": 7
      }
    ]
  }
];


// const colors = {
//   "Spinning": "#0570b0",
//   "Chickens": "#3690c0",
//   "Earthen": "#74a9cf",
//   "Chamber Pots": "#a6bddb",
//   "Laundry": "#d0d1e6",
//   "Dairy": "#ece7f2",
//   "Brew": "#ffeda0",
//   "HH Linens": "#fed976",
//   "Distill" : "#bd0026",
//   "Textile": "#feb24c",
//   "Hunt War": "#bd0026",
//   "Sewing": "#e31a1c",
//   "Women Clothes": "#fc4e2a",
//   "Men clothes": "#fd8d3c",
//   "Razor": "#feb24c"
// };

const colors = {
   "Spinning": "#0570b0",
   "Chickens": "#3690c0",
   "Earthen": "#74a9cf",
   "Chamber Pots": "#a6bddb",
   "Laundry": "#d0d1e6",
   "Dairy": "#ece7f2",
   "Brew": "#ffeda0",
   "HH linens": "#fed976",
   "Textile": "#feb24c",
   "Hunt War": "#fd8d3c",
   "Razor": "#bd0026",
   "Men Clothes": "#0570b0",
   "Women Clothes": "#fc4e2a",
   "Distill" : "#ffeda0",
   "Sewing": "#fc4e2a"
};

const stepOneData =[
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
    "name": "Men Clothes",
    "value": 203
  },
  {
    "name": "Women Clothes",
    "value": 56
  },
  {
    "name": "Either Clothes",
    "value": 229
  },
  {
    "name": "Both Clothes",
    "value": 30
  },
  {
    "name": "Absent",
    "value": 119
  }
];
