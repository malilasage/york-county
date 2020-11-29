console.log("hello");
window.addEventListener('load', function() {
    // console.log('All assets are loaded');
    removeClass();
    showSlides(slideIndex);
})

function removeClass(){
  const slides = [...document.getElementsByClassName("fade")];
    let options = {
      rootMargin: "0px",
      threshold: 0.25
    };

    const callback = (entries, observer) => {
      entries.forEach(entry => {
    		const { target } = entry;
    		// console.log(entry, target)

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
//showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
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

//////
  //import Reveal from '{{ site.baseurl }}/assets/js/reveal.js/dist/reveal.esm.js';
  //import Markdown from '{{ site.baseurl }}/assets/js/reveal.js/plugin/markdown/markdown.esm.js';

//td: figure out mousewheel, embed, markdown, and start setting up and adding content (just enough for concept proof), change content layout for err msg, disable non local img links
/*$(window).on("load", () => {
  let deck1 = new Reveal(document.querySelector('.deck1'), {
    //embedded: true,
    touch: true,
    //keyboardCondition: 'focused',
    mouseWheel: true,
    plugins: [ RevealMarkdown ]
  });
  deck1.initialize();
})*/

//deck1.initialize();
  /*Reveal.initialize({
    plugins: [ RevealMarkdown ]
  });*/


/*const sections = [...document.querySelectorAll("section")];

let options = {
  rootMargin: "0px",
  threshold: 0.25
};

const callback = (entries, observer) => {
  entries.forEach(entry => {
		const { target } = entry;
		console.log(entry, target)

		if (entry.intersectionRatio >= 0.25) {
			target.classList.add("is-visible");
		} else {
			target.classList.remove("is-visible");
		}
  });
};

const observer = new IntersectionObserver(callback, options);

sections.forEach((section, index) => {
  observer.observe(section);
});

window.onload(removeClass());*/

/*(function() {
  $(window).on("load", () => {
    $(window).scroll(function() {
      var windowBottom = $(this).scrollTop() + $(this).innerHeight();

      $(".masthead").each(function() {
        var objectBottom = $(this).offset().top + $(this).outerHeight();

        if (objectBottom < windowBottom) {

            if($(".masthead").css("display")=="none"){
              $(".masthead").stop().animate({
                "display": "block"
              });
            }
          } else {
            //something that's not display jfc
            if ($(".masthead").css("display")=="block"){
              $(".masthead").stop().animate({
              "display": "none"
              });
            }
          }
        })
      })
    })
})();*/
