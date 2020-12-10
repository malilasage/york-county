$(window).on("load", () => {
  $("#progress").addClass("progress");
  navClickListener();

  AOS.init({
    easing: 'ease-in-quart'
    // offset: 720
  });

  //progress bar
  $(window).scroll(() => {
    $("body").get(0).style.setProperty("--scroll", $(window).scrollTop() / ($("body")[0].scrollHeight - $(window).innerHeight()));
  })

  //carousel
  var initSlideIndex = 1;
  showSlides(initSlideIndex);

  //data vizualizations
  const sankeyData = ["/york-county/assets/data/marrott-data.csv", "/york-county/assets/data/besouth-data.csv"];

  var currentSection;

  document.addEventListener('aos:in:foo', ({ detail }) => {
    var id = $(detail).attr('data-index');

    if(id != currentSection) {
      currentSection = id;
      clean("svg").then(() => {
        initSankey(sankeyData[id]);
      }).catch((err) => {
        console.log(err);
      })
    }
  });

  vegaEmbed('#timeline-wrapper', vSpec);
  // main();

});






var navLinks = $('nav > ul > li > a');
var sections = $($(".section").get().reverse());
var sectionToNavLink = {};

sections.each(function() {
  var id = $(this).attr('id');
  sectionToNavLink[id] = $('nav > ul > li > a[href=\\#' + id + ']');
});

function highlightNav() {
  var scrollPosition = $(window).scrollTop();

  sections.each(function() {
    var currentSection = $(this);
    var sectionTop = currentSection.offset().top;

    if (scrollPosition >= sectionTop) {
      var id = currentSection.attr('id');
      var navLink = sectionToNavLink[id];

      if (!navLink.hasClass('active-nav')) {
        navLinks.removeClass('active-nav');
        navLink.addClass('active-nav');
      }
      return false;
    }
  });
}
$(window).scroll(highlightNav);


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
    .duration(500)
    .style("opacity", 0)
    .remove();
    // .end();

    // svg.remove();
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
