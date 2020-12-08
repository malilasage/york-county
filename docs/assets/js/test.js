$(window).on("load", () => {
  $("#progress").addClass("progress");
  navClickListener();

  AOS.init({
    easing: 'ease-in-quart'
  });

  //progress bar
  window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.scrollHeight - window.innerHeight));
  }, false); //change height access to jquery

  //carousel
  var initSlideIndex = 1;
  showSlides(initSlideIndex);

  //data vizualizations
  var sankeyData = ["/york-county/assets/data/marrott-data.csv", "/york-county/assets/data/besouth-data.csv"];

  document.addEventListener('aos:in', ({ detail }) => {
    var dataId = $(detail).attr("data-index");
     if(dataId) {
       clean("svg").then(() => {
         initSankey(sankeyData[dataId]);
       });
     }
  });


  vegaEmbed('#timeline-wrapper', vSpec);
  // main();

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

//carousel
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




//remove d3 vizualizations
async function clean(chart) {
  var svg = d3.select("#sK-wrapper").select("svg");

  await svg.transition()
    .duration(2000)
    .attr("opacity", 0)
    .end();

    svg.remove();
}


//vegalite timeline
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
