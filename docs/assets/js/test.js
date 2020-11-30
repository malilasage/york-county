/*
narrative box
<div>
  <div id="background">
    <div class="section" id="title">
      <h1>title</h1>
    </div>
    <div class="section" id="1">
      <h1>1</h1>
    </div>
    <div class="section">
      <h1>2</h1>
    </div>
  </div>
  <div id="foreground">
    <div class="section">
      <h1>A</h1>
    </div>
    <div class="section" id="B">
      <h1>B</h1>
    </div>
    <div class="section">
      <h1>C</h1>
    </div>
  </div>
   <div id="background">
    <div class="section" id="title">
      <h1>title</h1>
    </div>
    <div class="section" id="1">
      <h1>1</h1>
    </div>
    <div class="section">
      <h1>2</h1>
    </div>
  </div>
    <div id="foreground">
    <div class="section">
      <h1>A</h1>
    </div>
    <div class="section" id="B">
      <h1>B</h1>
    </div>
    <div class="section">
      <h1>C</h1>
    </div>
  </div>
</div>

#background {
/*   height: 100vh; */
/*   background-color: blue; */
/*   position: sticky; */
/*   position: fixed; */
/*   height: 100%; */
/*   position: fixed; */
/*   opacity: 0.6; */
/*   top: 0; */
//  width: 100%;
//}

//#title {
  //position: sticky;
  // top: 0;
// }

//#1 {
/*   position: sticky; */
/*   top: 0; */
//}

// .sticky {
//   position: sticky;
// }
//
// #background .section {
//   text-align: center;
//   height: 200px;
//   border: 5px dashed black;
// }
//
// #foreground {
//   background-color: pink;
//   color: red;
//   text-align: center;
//   opacity: 0.8;
//   height: 100%;
//   width: 50%;
// }
//
// #foreground .section {
//   height: 100vh;
//   border: 2px dashed red;
// }

$(window).on("load", () => {
  var initSlideIndex = 1;

  removeClass();
  showSlides(initSlideIndex);

  $("#progress").addClass("progress");
  navClickListener();
  AOS.init({
    easing: 'ease-in-out-cubic'
  });
  vegaEmbed('#timeline-wrapper', vSpec);
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
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  if(slideIndex != 1) {
    $('html, body').animate({
      scrollTop: $("#context").offset().top
    }, 1000);
  }
}

window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.scrollHeight - window.innerHeight));
}, false); //change height access to jquery

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
