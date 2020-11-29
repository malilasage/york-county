$(window).on("load", () => {
  var initSlideIndex = 1;

  removeClass();
  showSlides(initSlideIndex);

  $("#progress").addClass("progress");
  navClickListener();
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
