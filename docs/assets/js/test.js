console.log("hello");
window.addEventListener('load', function() {
    // console.log('All assets are loaded');
    removeClass();
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
}


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
