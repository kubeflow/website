var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

(function($) {

	$(function() {

		$(".collapsible").click(function () {
			$(this).toggleClass('open');
			$(this).next().slideToggle("fast");
		});


		// Breakpoints from Sass variables:
		// $small-screen: 480px
		// $medium-screen: 769px
		// $m-large-screen: 960px
		// $large-screen: 1200px
		// $x-large-screen: 1600px

		$(window).breakpoints({
			breakpoints: [{
				"name": "sm",
				"width": 480
			}, {
				"name": "md",
				"width": 769
			}, {
				"name": "md-lg",
				"width": 960
			}, {
				"name": "lg",
				"width": 1200
			}, {
				"name": "x-lg",
				"width": 1600
			}]
		});

		$(window).breakpoints("lessThan", "lg", function() {
			// if less than large width, collapse by default
			$('.collapsible').removeClass('open').each(function() {
				$(this).next().hide("fast");			
			});
		});
		$(window).breakpoints("greaterEqualTo", "lg", function() {
			// if greater than or equal to large with, open by default
			$('.collapsible').addClass('open').each(function() {
				$(this).next().show("fast");			
			});

		});
		// Constant Check Example
		$(window).bind("breakpoint-change", function(event) {
			$(window).breakpoints("lessThan", "lg", function() {
				// if less than large width, collapse by default
				$('.collapsible').removeClass('open').each(function() {
					$(this).next().hide("fast");			
				});
			});
			$(window).breakpoints("greaterEqualTo", "lg", function() {
				// if greater than or equal to large with, open by default
				$('.collapsible').addClass('open').each(function() {
					$(this).next().show("fast");			
				});
			});
		});

		// sticky subnav
		var  sn = $("#subNav");
		    sns = "scrolled";
		    hdr = $('header').height();

		$(window).scroll(function() {
		  if( $(this).scrollTop() > hdr + 70) {
		    sn.addClass(sns);
		  } else {
		    sn.removeClass(sns);
		  }
		});

	// ******************************** //
		// add mobile class to body if isMobile
		if(isMobile.any()) {
			$("body").addClass("mobile");
		}

		// Find all iframes
		var $iframes = $("iframe");
		 
		// Find & save the aspect ratio for all iframes
		$iframes.each(function () {
			$(this).data("ratio", this.height / this.width)
				// Remove the hardcoded width &#x26; height attributes
				.removeAttr("width")
				.removeAttr("height");
		});

		// make certain things happen on load and on resize
		$(window).resize(function () {
			$iframes.each( function() {
				// Get the parent container'&#x27;'s width
				var width = $(this).parent().width();
				$(this).width(width)
					.height(width * $(this).data("ratio"));
			});
		}).resize(); // Invoke the resize event immediately


		// mainNav active toggle
		$('#menuTrigger a').click(function() {
			$(this).parent().toggleClass('open');
			$('body').toggleClass('nav-active');
			return false;
		});

		// smooth anchor scrolling: https://css-tricks.com/snippets/jquery/smooth-scrolling/
		$('a[href*="#"]:not([href="#"])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html, body').animate({
					  scrollTop: target.offset().top
					}, 200);
					return false;
				}
			}
		});


		// Replace all SVG images with inline SVG
		jQuery('img.svg').each(function(){
		    var $img = jQuery(this);
		    var imgID = $img.attr('id');
		    var imgClass = $img.attr('class');
		    var imgURL = $img.attr('src');

		    jQuery.get(imgURL, function(data) {
		        // Get the SVG tag, ignore the rest
		        var $svg = jQuery(data).find('svg');

		        // Add replaced image's ID to the new SVG
		        if(typeof imgID !== 'undefined') {
		            $svg = $svg.attr('id', imgID);
		        }
		        // Add replaced image's classes to the new SVG
		        if(typeof imgClass !== 'undefined') {
		            $svg = $svg.attr('class', imgClass+' replaced-svg');
		        }

		        // Remove any invalid XML tags as per http://validator.w3.org
		        $svg = $svg.removeAttr('xmlns:a');

		        // Replace image with new SVG
		        $img.replaceWith($svg);

		    }, 'xml');

		});

		// fade out page loading overlay once document is ready
		// $("#loader").fadeOut("slow");

		// disable google map zooming until clicked
		// $('.map-container').click(function(){
		// 	$(this).find('iframe').addClass('clicked')
		// }).mouseleave(function(){
		// 	$(this).find('iframe').removeClass('clicked')
		// });

		// stellar parallax scrolling disabled on mobile
		// if( !isMobile.any() ){
		// 	$.stellar({
		// 		horizontalScrolling: false,
		// 		verticalOffset: 40
		// 	});
		// }

		// RETINA images / background-images
		// if(window.devicePixelRatio >= 1.2){
		// 	$("[data-2x]").each(function(){
		// 		if(this.tagName == "img"){
		// 			$(this).attr("src",$(this).attr("data-2x"));
		// 		} else {
		// 			$(this).css({"background-image":"url("+$(this).attr("data-2x")+")"});
		// 		}
		// 	});
		// }

		// equal height columns: http://brm.io/jquery-match-height/
		// $('.match-height > div').matchHeight();


	});
})(jQuery);

