$(window).on("load", () => {
  var initSlideIndex = 1;

  removeClass();
  showSlides(initSlideIndex);

  $("#progress").addClass("progress");
  navClickListener();
  AOS.init({
    easing: 'ease-in-quart'
  });
  vegaEmbed('#timeline-wrapper', vSpec);
  main();
});

function navClickListener(){
  $("nav li a").click(() => {
  var linkId = $(event.target).attr("href");
    $("nav li a").removeClass();
    if(linkId != "#title") {
      $(event.target).addClass("active-nav");
    }
  });
}

function removeClass(){
  const slides = [...document.getElementsByClassName("fade")];
    let options = {
      rootMargin: "0px",
      threshold: 0.25
    };

    const callback = (entries, observer) => {
      entries.forEach(entry => {
    		const { target } = entry;

    		if (entry.intersectionRatio >= 0.25) {
    			target.classList.add("is-visible");
    		} else {
    			target.classList.remove("is-visible");
    		}
      });
    };

    const observer = new IntersectionObserver(callback, options);

    slides.forEach((slide, index) => {
      observer.observe(slide);
    });
};

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
