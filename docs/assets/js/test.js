
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
