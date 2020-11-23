
(function() {
  //alert("hello");
/*  $(window).on("load", () => {
    nav = document.getElementsByClassName("masthead");
    splashImage = document.getElementsByClassName("page__hero");
    console.log(splashImage); //change to if main page or just only run script from index

    if(splashImage.length > 0) {
      console.log("yay");

          $(window).scroll(function() {
              mainNav();
          });
          function mainNav() {
              var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
              if (top > 40) {
                console.log("40");
                $('.masthead').css("visibility", "visible");
              }
              else {
                $('.masthead').hide();
              }
      	    }


    }
  });
/*  $( window ).on( "load", function() {
    mainNav();
    console.log("fun");

    $(window).scroll(function() {
        console.log("scroll");
        mainNav();
    });

    function mainNav() {
        var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        if (top > 40) {
        console.log("top");
          $('.masthead').stop().animate({
            "opacity": '1',
            "top": '0'
          });
        }
        else {
          $('.masthead').stop().animate({
            "top": '-70',
            "opacity": '0'
          });
        }
	    }
    });*/
})();
