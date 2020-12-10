  const newData = [
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

 async function _data() {
   return d3
   .json("/york-county/assets/data/circ.json");
 }

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

 async function initBub() {
       const dataN = await _data();
       const real2 = processData(dataN);
       drawBub(real2);
 }

function drawBub(real2) {
  const width = 680;
  const height = 680;

     const svg = d3.select("#chart").append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
  // const colors = ["red", "yellow", "orange", "green"];
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

   // const label = svg.append("g")
   //    .style("font", "12px sans-serif")
   //    // .attr("text-anchor", "middle")
   //  .selectAll("text")
   //  .data(nodes)
   //  .join("text")
   //    .text(d => d.name)
   //    .attr("x", d => positioning[i].x + d.x)
   //    .attr("y", d => positioning[i].y + d.y);

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
         .transition().duration(2000)
         .attr("opacity", 1);

    simulation.on("tick", () => {
    // link
    //     .attr("x1", d => d.source.x)
    //     .attr("y1", d => d.source.y)
    //     .attr("x2", d => d.target.x)
    //     .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  // invalidation.then(() => simulation.stop());



  })
    return svg.node();
}


// function drawBub(newData, real2) {
//
//   const width = 680;
//   const height = 680;
//  const nodes = newData.map(d => Object.create(d));
//   console.log(nodes);
//
//    const simulation = d3.forceSimulation(nodes)
//       .force("charge", d3.forceManyBody())
//       // .force("x", d3.forceX()) //controls axis
//       .force("y", d3.forceY())
//       .force("collide", d3.forceCollide(width/28, height/16));
//
//     const svg = d3.select("#chart").append("svg")
//       .attr("viewBox", [-width/2, -height/2, width, height]);
//
//     const node = svg.append("g")
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 1.5)
//     .selectAll("circle")
//     .data(nodes)
//     .join("circle")
//       .attr("r", d => d.value/8)
//       .attr("opacity", 0.5)
//       .attr("fill", d => colors[d.name]);
//
//     // node.append("title")
//     //   .text(d => {
//     //   console.log(d.name);
//     //   return d.name;
//     // });
//
//      const label = svg.append("g")
//       .style("font", "12px sans-serif")
//       // .attr("text-anchor", "middle")
//     .selectAll("text")
//     .data(nodes)
//     .join("text")
//       .text(d => d.name)
//       .attr("x", (d, i) => {100 + i*25})
//       .attr("y", 100)
//       .style("fill", d => d.color)
//       .attr("text-anchor", "left");
//
//
//       // label.append("g").shape("path",d3.symbol().type(d3.symbolCircle).size(150)())
//
//
// //   const legend = svg.append('g')
// //         .attr('class', 'categoryLegend')
// //         .attr('transform', `translate(${x},${y})`)
//
// //     categoryLegend = d3.legendColor()
// //                             .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
// //                             .shapePadding(10)
// //                             .scale(categoryColorScale)
//
//   //   svg.append("g").selectAll("mylabels")
//   // .data(nodes)
//   // .join("text")
//   //   .attr("x", 120)
//   //   .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
//   //   .style("fill", d => d.color)
//   //   .text(function(d){ return d})
//   //   .attr("text-anchor", "left")
//   //   .style("alignment-baseline", "middle")
//
//     simulation.on("tick", () => {
//     // link
//     //     .attr("x1", d => d.source.x)
//     //     .attr("y1", d => d.source.y)
//     //     .attr("x2", d => d.target.x)
//     //     .attr("y2", d => d.target.y);
//
//     node
//         .attr("cx", d => d.x)
//         .attr("cy", d => d.y);
//   });
//
//   svg.on("click", () => {
//          svg.selectAll('circle')
//         .transition().duration(2000)
//         .attr('r', d => d.value/16)
//         .attr('opacity', "0")
//         .attr("cx", 0)
//         .attr("cy", 0)
//         .remove();
//         stepTwo();
//         // .on("end", (d) => {
//         //    endall(d, stepTwo)
//         //  });
//         // .remove()
// //         .call(endall, function() {
// // console.log("all done"); });
//
//     // stepTwo();
//   })
//    var n = 0;
// function endall(transition, callback) {
// console.log(transition.empty());
//   console.log(n);
//   if(n === 14) {
//     // stepTwo();
//     console.log("bigly");
//   }
//   n++;
//   // transition
//   //   .each(function() { console.log(n), ++n; })
//   //   .each("end", function() { if (!--n) callback.apply(this, arguments);});
// }
//
// //And then, rather than each("end", callback), say call(endall, callback):
//
// // d3.selectAll("g").transition().call(endall, function() {
// // console.log("all done"); });
//
//   function stepTwo() {
//       const positioning = [{"x": -100, "y": -100}, {"x": -100, "y": 100},{"x": 100, "y": -100},{"x": 100, "y": 100}];
//
//   real2.forEach((year, i) => {
//     console.log(year);
//     // const svg = d3.select("svg").append("g")
//     var m = i*10;
//     var n = i*2;
//    const nodes = year.children.map(d => Object.create(d));
//     // console.log(nodes);
//
//    const simulation = d3.forceSimulation(nodes)
//       .force("charge", d3.forceManyBody())
//       .force("x", d3.forceX(d => positioning[i].x)) //controls axis
//       .force("y", d3.forceY(d => positioning[i].y))
//       .force("collide", d3.forceCollide((width/40), (height/40)));
//
//
//
//     const node = svg.append("g")
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 1.5)
//     .selectAll("circle")
//     .data(nodes)
//     .join("circle")
//       .attr('r', d => d.value/16)
//       .attr('opacity', "0.1")
//       .attr("cx", 0)
//       .attr("cy", 0)
//        .transition().duration(2000).delay(6000)
//        .attr("r", d => d.value/5)
//        .attr("opacity", 0.5)
//       .attr("fill", d => {
//         var c = colors[d.name];
//         // console.log(d.name + c)
//         return c;
//       });
//
//     // node.append("text")
//     //   .text(d => {
//     //   console.log(d.name);
//     //   return d.name;
//     // });
//
//    const label = svg.append("g")
//       .style("font", "12px sans-serif")
//       // .attr("text-anchor", "middle")
//     .selectAll("text")
//     .data(nodes)
//     .join("text")
//       .text(d => year.name)
//       .attr("x", d => positioning[i].x)
//       .attr("y", d => positioning[i].y);
//
//      // const title = svg.append("g")
//      // .selectAll("text")
//      //  .data(year)
//      //  .enter()
//      // .text(year.name)
//      //  .attr("x", positioning[i].x)
//      //  .attr("y", positioning[i].y)
//
//     svg.append("g").style("font-size", "2px")
//       .selectAll("title")
//       .data(year)
//       // .enter()
//       .join("text")
//         .text(year.name)
//         .attr("x", positioning[i].x)
//         .attr("y", positioning[i].y)
//
//   //      svg.selectAll("mylabels")
//   // .data(keys)
//   // .enter()
//   // .append("text")
//   //   .style("font-size", "2px")
//   //   .attr("x", 15)
//   //   .attr("y", function(d,i){ return 10 + i*5}) // 100 is where the first dot appears. 25 is the distance between dots
//   //   .style("fill", function(d){ return colors[d]})
//   //   .text(function(d){ return d})
//   //   .attr("text-anchor", "left")
//   //   .style("alignment-baseline", "middle")
//
//     simulation.on("tick", () => {
//     // link
//     //     .attr("x1", d => d.source.x)
//     //     .attr("y1", d => d.source.y)
//     //     .attr("x2", d => d.target.x)
//     //     .attr("y2", d => d.target.y);
//
//     node
//         .attr("cx", d => d.x)
//         .attr("cy", d => d.y);
//   });
//
//   })
//   }
//
//
//   // invalidation.then(() => simulation.stop());
//
//   return svg.node();
// }
