---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: splash
header:
  image: https://s3.amazonaws.com/omeka-net/3854/archive/files/4ec851e1114c13cd0678409ea18c6aaa.jpg?AWSAccessKeyId=AKIAI3ATG3OSQLO5HGKA&Expires=1606953600&Signature=2UaoL0kXaQjvXqBitP72wpWLu5Y%3D
---

{::comment}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
$( window ).on( "load", function() {
  console.log("hello");
    mainNav();
    $(window).scroll(function() {
        mainNav();
    });
    function mainNav() {
        var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if (top > 40) $('.masthead').stop().animate({
            "opacity": '1',
            "top": '0'
        });
        else $('.masthead').stop().animate({
            "top": '-70',
            "opacity": '0'
        });

	}
     });
</script>
{:/comment}
