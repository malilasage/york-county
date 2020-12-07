$(window).on("load", () => {
  var initSlideIndex = 1;

  showSlides(initSlideIndex);

  $("#progress").addClass("progress");
  navClickListener();
  AOS.init({
    easing: 'ease-in-quart'
  });
  vegaEmbed('#timeline-wrapper', vSpec);
  //main();
  //initSankey();
  // initNarrative();
  var initialized = false;
  document.addEventListener('aos:in', ({ detail }) => {
    console.log('animated in', detail);
    var eleId = $(detail).attr("id");
    console.log(eleId);
    if(eleId === "sK-wrapper" && !initialized) {
      initSankey();
      initialized = true;
    }
  });
});

function initNarrative() {

}

function navClickListener(){
  $("nav li a").click(() => {
  var linkId = $(event.target).attr("href");
    $("nav li a").removeClass();
    if(linkId != "#title") {
      $(event.target).addClass("active-nav");
    }
  });
}

var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("carousel-slide");
  var dot = document.getElementById("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  /*for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }*/
  slides[slideIndex-1].style.display = "block";
  $(dot).text([slideIndex] + "/4");
  if(slideIndex != 1) {
    $('html, body').animate({
      scrollTop: $("#context").offset().top
    }, 1000);
  }
}

window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.scrollHeight - window.innerHeight));
}, false); //change height access to jquery

//chart
function _chart(data, width, height, pack, color, format) {
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

async function _data() {
  return d3
  .json("/york-county/assets/data/circ.json");
}

async function main() {
  const height = 600;
  const width = 600;
  const color = _color();
  const format = _format();
  const data = await _data();
  const pack = _pack(data, width, height);
  const chart = _chart(data, width, height, pack, color, format);
}
/////////sankey

function _sChart(width, height, data, sankey, tDuration) {
 const svg = d3.select("#sK-wrapper")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const {nodes, links} = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  var startNodes = nodes.filter((d) => {
   //console.log(d);
   return d.depth < 2 ? d : null;
});

  var startLinks = links.filter((d) => {
    return d.target.depth < 2 ? d: null;
  });

svg.append("g")
  .selectAll("rect")
  .data(nodes)
  .join("rect")
      //.attr("x", d => d.x0)
      .attr("x", d => 0)
      .attr("y", d => d.y1 - ((d.y1 - d.y0)/2))
      .attr("height", 1) //(d.y0 + 2) - d.y1
      // .attr("width", d => d.x1 - d.x0)
      .attr("width", 0)
      .attr("opacity", 0.7)
      .attr("fill", d => {
        let c;
          for (const link of d.sourceLinks) {
            c = d3.color("#bd0026").darker(0.3);
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
    .attr("stroke", d => d3.color(d.color));
    // .attr("stroke-width", "5px");

  link.append("path")
    //.attr("d", d3.sankeyLinkHorizontal())
    .attr("d", d3.sankeyLinkHorizontal().x(null))
    //.attr("d", 0)
    //.attr("d", )
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
        .style("font-size", "12px")
        .on("end", appendVal());
      /*.text(d => {
              const parseFloat = d3.format(",.0f");
              var parsed = parseFloat(d.value);

              return ` ${parsed.toLocaleString()}`;
           })
        .attr("fill-opacity", 0.7);*/
        /*.append("tspan")
           .attr("fill-opacity", 0.7)
           .text(d => {
              const parseFloat = d3.format(",.0f");
              var parsed = parseFloat(d.value);

              return ` ${parsed.toLocaleString()}`;
           });*/

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

function _parseSData(dataFile) { //async?

  const colors = _sColors();
 const links = d3.csvParseRows(dataFile, ([parentCategory, Item, price]) => ({
    source: parentCategory,
    target: Item,
    value: +[price]
    //value: parseFloat(price) do this in text so values add up right
  })).filter((ele) => {
   return ele.source === "Total Estate Value" ? ele : null;
 });
    //var colors = {"Slaves": "green"};
  //map to nodes/links
  const nodeByName = new Map;
  for(const link of links) {
     if (!nodeByName.has(link.target)) nodeByName.set(link.target, {name: link.target});
        if (!nodeByName.has(link.source))
          nodeByName.set(link.source, {name: link.source});
    if(!link.color) {
      var linkCategory = link.target;
      var linkColor = d3.color(colors[linkCategory]).brighter(0.2);
      //console.log(colors[linkCategory]);
      link.color = linkColor;
      //nodeByName.set(link.color, {color: linkColor});
    }
  }
  return {nodes: Array.from(nodeByName.values()), links};

}

async function _sData() {
  return fetch("/york-county/assets/data/marrott-data.csv").then((response) => {
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
   "Silver Plate": "#045a8d"
  }
  return colors;
}

async function initSankey() {
  const width = 954;
  const height = 700;
  const tDuration = 3000;
  const data = await _sData();
  const parsed = await _parseSData(data);
  const sankey = _sankey(width, height);
  const chart = _sChart(width, height, parsed, sankey, tDuration);
}

////end sankey

var vSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "width": "container",
  "height": "container",
  "description": "Google's stock price over time.",
  "data": {
    "url": "/york-county/assets/data/trend-test2.json",
    "format": {
      "parse": {
        "Year": "date:%Y"
      }
    }
  },
  "transform": [{"filter": "datum.Item!=='HH Linens'"}],
  "encoding": {
    "x": {
      "field": "Year",
      "type": "temporal",
      "title": "date",
      "axis": {"tickCount": {"interval": "year", "step": 25}}
      },
    "y": {"field": "Amount", "type": "quantitative", "title": "price"},
    "color": {
      "condition": {
        "selection": "hover",
        "field":"Item",
        "type":"nominal",
        "legend": null
      },
      "value": "grey"
    },
    "opacity": {
      "condition": {
        "selection": "hover",
        "value": 1
      },
      "value": 0.2
    }
  },
  "layer": [{
    "description": "transparent layer to make it easier to trigger selection",
    "selection": {
      "hover": {
        "type": "single",
        "on": "mouseover",
        "empty": "all",
        "fields": ["Item"],
        "init": {"Item": "Chamber Pots"}
      }
    },
    "mark": {"type": "line", "strokeWidth": 8, "stroke": "transparent"}
  }, {
    "mark": "line"
  }, {
    "encoding": {
      "x": {"field": "Year"},
      "y": {"field": "Amount"}
    },
    "layer": [{
      "mark": {"type": "circle"}
    }]
  }],
  "config": {"view": {"stroke": null}}
};



/*

try: filter {selection: item } where wealth = Top.
line 1 = amount where wealth = top and item = chamber pot
line 2 = amount where wealth = top and item = HH
x: {field: {repeat: lines}} (or repeat wealth categories)
https://vega.github.io/vega-lite/docs/field.html
    "format": {
      "parse": {
        "Year": "date:%Y"
      }
    }
  },
  "encoding": {
    "x": {
      "field": "Year",
      "type": "temporal",
      "title": "date",
      "axis": {"tickCount": {"interval": "year", "step": 25}}
      },
    "y": {"field": "Amount", "type": "quantitative", "title": "price"},
    "color": {
      "condition": {
        "selection": "hover",
        "field":"Wealth",
        "type":"nominal",
        "legend": null
      },
      "value": "grey"
    },
    "opacity": {
      "condition": {
        "selection": "hover",
        "value": 1
      },
      "value": 0.2
    }
  },
  "layer": [{
    "description": "transparent layer to make it easier to trigger selection",
    "selection": {
      "hover": {
        "type": "single",
        "on": "mouseover",
        "empty": "all",
        "fields": ["Wealth"],
        "init": {"Wealth": "Top"}
      }
    },
    "mark": {"type": "line", "strokeWidth": 8, "stroke": "transparent"}
  }, {
    "mark": "line"
  }, {
    "encoding": {
      "x": {"field": "Year"},
      "y": {"field": "Amount"}
    },
    "layer": [{
      "mark": {"type": "circle"}},
      {
      "mark": {"type": "text", "align": "left", "dx": 4},
      "encoding": {"text": {"field":"Wealth", "type": "nominal"}}
    }]
  }],
  "config": {"view": {"stroke": null}}
}
///////////
  "repeat": {
    "layer": ["Wealth", "Item"]
  },
  "spec":{
    "mark": "line",
  "encoding": {
    "x": {
      "field": "Year",
      "type": "temporal",
      "title": "date",
      "axis": {"tickCount": {"interval": "year", "step": 25}}
      },
    "y": {"field": {"repeat": "layer"}, "title": "price"}
    }
  },
  "layer": [{
    "description": "transparent layer to make it easier to trigger selection",
    "selection": {
      "hover": {
        "type": "single",
        "on": "mouseover",
        "empty": "all",
        "fields": ["Wealth"],
        "init": {"Wealth": "Top"}
      }
    },
    "mark": {"type": "line", "strokeWidth": 8, "stroke": "transparent"}
  },
  {
    "mark": "line"
  }, {
    "encoding": {
      "x": {"field": "Year"},
      "y": {"field": "Amount"}
    },
    "layer": [{
      "mark": {"type": "circle"}},
      {
      "mark": {"type": "text", "align": "left", "dx": 4},
      "encoding": {"text": {"field":"Wealth", "type": "nominal"}}
    }]
  }],
  "config": {"view": {"stroke": null}}
} lmaooooooo

 "repeat": {"layer": ["Item", "Wealth","Amount"]},
  "spec": {
    "mark": "line",
    "encoding": {
    "x": {
      "field": "Year",
      "type": "temporal",
      "title": "date",
      "axis": {"tickCount": {"interval": "year", "step": 25}}
      },
      "y": {
        "field": "amount", "filter": {"selection": {"repeat": "layer"}},
        "title": "Mean of US and Worldwide Gross"
      },
      "color": {"datum": {"repeat": "layer"}, "type": "nominal"}
    }
  }
}
*/
