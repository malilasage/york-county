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
  _initLine("/york-county/assets/data/item-trends.tsv");

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

  jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = new MouseEvent("click");
    e.dispatchEvent(evt);
  });
};

initCircles();
legend();
  var curCircle = 0;
  document.addEventListener('aos:in:bar', ({ detail }) => {
    var id = $(detail).attr('data-index');
    const draw = [drawCircles, drawForce];

    if(id != curCircle) {
      curCircle = id;
      clean("circle").then(() => {
        var svg = d3.select("#chart").select("svg");
        draw[id](svg);
      }).catch((err) => {
        console.log(err);
      })
    }
  });
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
  if(chart === "svg") {
    var svg = d3.select("#sK-wrapper").select("svg");

    await svg.transition()
      .duration(500)
      .style("opacity", 0)
      .remove();

      // svg.remove();
  }
  else if(chart === "circle") {
    var svg = d3.select("#chart");

    var delay = timeout(2000);
    /*await*/ svg.transition().duration(2000)
            .selectAll('circle')
              .attr('r', d => d.value/16)
              .attr('opacity', "0")
              .attr("cx", 0)
              .attr("cy", 0);
          svg.transition().delay(2000).selectAll("g").remove();

    await delay;
  }

}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
