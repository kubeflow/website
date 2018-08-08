/*! jQuery Migrate v3.0.0 | (c) jQuery Foundation and other contributors | jquery.org/license */
"undefined"==typeof jQuery.migrateMute&&(jQuery.migrateMute=!0),function(a,b){"use strict";function c(c){var d=b.console;e[c]||(e[c]=!0,a.migrateWarnings.push(c),d&&d.warn&&!a.migrateMute&&(d.warn("JQMIGRATE: "+c),a.migrateTrace&&d.trace&&d.trace()))}function d(a,b,d,e){Object.defineProperty(a,b,{configurable:!0,enumerable:!0,get:function(){return c(e),d}})}a.migrateVersion="3.0.0",function(){var c=b.console&&b.console.log&&function(){b.console.log.apply(b.console,arguments)},d=/^[12]\./;c&&(a&&!d.test(a.fn.jquery)||c("JQMIGRATE: jQuery 3.0.0+ REQUIRED"),a.migrateWarnings&&c("JQMIGRATE: Migrate plugin loaded multiple times"),c("JQMIGRATE: Migrate is installed"+(a.migrateMute?"":" with logging active")+", version "+a.migrateVersion))}();var e={};a.migrateWarnings=[],void 0===a.migrateTrace&&(a.migrateTrace=!0),a.migrateReset=function(){e={},a.migrateWarnings.length=0},"BackCompat"===document.compatMode&&c("jQuery is not compatible with Quirks Mode");var f=a.fn.init,g=a.isNumeric,h=a.find,i=/\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/,j=/\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g;a.fn.init=function(a){var b=Array.prototype.slice.call(arguments);return"string"==typeof a&&"#"===a&&(c("jQuery( '#' ) is not a valid selector"),b[0]=[]),f.apply(this,b)},a.fn.init.prototype=a.fn,a.find=function(a){var b=Array.prototype.slice.call(arguments);if("string"==typeof a&&i.test(a))try{document.querySelector(a)}catch(d){a=a.replace(j,function(a,b,c,d){return"["+b+c+'"'+d+'"]'});try{document.querySelector(a),c("Attribute selector with '#' must be quoted: "+b[0]),b[0]=a}catch(e){c("Attribute selector with '#' was not fixed: "+b[0])}}return h.apply(this,b)};var k;for(k in h)Object.prototype.hasOwnProperty.call(h,k)&&(a.find[k]=h[k]);a.fn.size=function(){return c("jQuery.fn.size() is deprecated; use the .length property"),this.length},a.parseJSON=function(){return c("jQuery.parseJSON is deprecated; use JSON.parse"),JSON.parse.apply(null,arguments)},a.isNumeric=function(b){function d(b){var c=b&&b.toString();return!a.isArray(b)&&c-parseFloat(c)+1>=0}var e=g(b),f=d(b);return e!==f&&c("jQuery.isNumeric() should not be called on constructed objects"),f},d(a,"unique",a.uniqueSort,"jQuery.unique is deprecated, use jQuery.uniqueSort"),d(a.expr,"filters",a.expr.pseudos,"jQuery.expr.filters is now jQuery.expr.pseudos"),d(a.expr,":",a.expr.pseudos,'jQuery.expr[":"] is now jQuery.expr.pseudos');var l=a.ajax;a.ajax=function(){var a=l.apply(this,arguments);return a.promise&&(d(a,"success",a.done,"jQXHR.success is deprecated and removed"),d(a,"error",a.fail,"jQXHR.error is deprecated and removed"),d(a,"complete",a.always,"jQXHR.complete is deprecated and removed")),a};var m=a.fn.removeAttr,n=a.fn.toggleClass,o=/\S+/g;a.fn.removeAttr=function(b){var d=this;return a.each(b.match(o),function(b,e){a.expr.match.bool.test(e)&&(c("jQuery.fn.removeAttr no longer sets boolean properties: "+e),d.prop(e,!1))}),m.apply(this,arguments)},a.fn.toggleClass=function(b){return void 0!==b&&"boolean"!=typeof b?n.apply(this,arguments):(c("jQuery.fn.toggleClass( boolean ) is deprecated"),this.each(function(){var c=this.getAttribute&&this.getAttribute("class")||"";c&&a.data(this,"__className__",c),this.setAttribute&&this.setAttribute("class",c||b===!1?"":a.data(this,"__className__")||"")}))};var p=!1;a.swap&&a.each(["height","width","reliableMarginRight"],function(b,c){var d=a.cssHooks[c]&&a.cssHooks[c].get;d&&(a.cssHooks[c].get=function(){var a;return p=!0,a=d.apply(this,arguments),p=!1,a})}),a.swap=function(a,b,d,e){var f,g,h={};p||c("jQuery.swap() is undocumented and deprecated");for(g in b)h[g]=a.style[g],a.style[g]=b[g];f=d.apply(a,e||[]);for(g in b)a.style[g]=h[g];return f};var q=a.data;a.data=function(b,d,e){var f;return d&&d!==a.camelCase(d)&&(f=a.hasData(b)&&q.call(this,b),f&&d in f)?(c("jQuery.data() always sets/gets camelCased names: "+d),arguments.length>2&&(f[d]=e),f[d]):q.apply(this,arguments)};var r=a.Tween.prototype.run;a.Tween.prototype.run=function(b){a.easing[this.easing].length>1&&(c('easing function "jQuery.easing.'+this.easing.toString()+'" should use only first argument'),a.easing[this.easing]=a.easing[this.easing].bind(a.easing,b,this.options.duration*b,0,1,this.options.duration)),r.apply(this,arguments)};var s=a.fn.load,t=a.event.fix;a.event.props=[],a.event.fixHooks={},a.event.fix=function(b){var d,e=b.type,f=this.fixHooks[e],g=a.event.props;if(g.length)for(c("jQuery.event.props are deprecated and removed: "+g.join());g.length;)a.event.addProp(g.pop());if(f&&!f._migrated_&&(f._migrated_=!0,c("jQuery.event.fixHooks are deprecated and removed: "+e),(g=f.props)&&g.length))for(;g.length;)a.event.addProp(g.pop());return d=t.call(this,b),f&&f.filter?f.filter(d,b):d},a.each(["load","unload","error"],function(b,d){a.fn[d]=function(){var a=Array.prototype.slice.call(arguments,0);return"load"===d&&"string"==typeof a[0]?s.apply(this,a):(c("jQuery.fn."+d+"() is deprecated"),a.splice(0,0,d),arguments.length?this.on.apply(this,a):(this.triggerHandler.apply(this,a),this))}}),a(function(){a(document).triggerHandler("ready")}),a.event.special.ready={setup:function(){this===document&&c("'ready' event is deprecated")}},a.fn.extend({bind:function(a,b,d){return c("jQuery.fn.bind() is deprecated"),this.on(a,null,b,d)},unbind:function(a,b){return c("jQuery.fn.unbind() is deprecated"),this.off(a,null,b)},delegate:function(a,b,d,e){return c("jQuery.fn.delegate() is deprecated"),this.on(b,a,d,e)},undelegate:function(a,b,d){return c("jQuery.fn.undelegate() is deprecated"),1===arguments.length?this.off(a,"**"):this.off(b,a||"**",d)}});var u=a.fn.offset;a.fn.offset=function(){var b,d=this[0],e={top:0,left:0};return d&&d.nodeType?(b=(d.ownerDocument||document).documentElement,a.contains(b,d)?u.apply(this,arguments):(c("jQuery.fn.offset() requires an element connected to a document"),e)):(c("jQuery.fn.offset() requires a valid DOM element"),e)};var v=a.param;a.param=function(b,d){var e=a.ajaxSettings&&a.ajaxSettings.traditional;return void 0===d&&e&&(c("jQuery.param() no longer uses jQuery.ajaxSettings.traditional"),d=e),v.call(this,b,d)};var w=a.fn.andSelf||a.fn.addBack;a.fn.andSelf=function(){return c("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)};var x=a.Deferred,y=[["resolve","done",a.Callbacks("once memory"),a.Callbacks("once memory"),"resolved"],["reject","fail",a.Callbacks("once memory"),a.Callbacks("once memory"),"rejected"],["notify","progress",a.Callbacks("memory"),a.Callbacks("memory")]];a.Deferred=function(b){var d=x(),e=d.promise();return d.pipe=e.pipe=function(){var b=arguments;return c("deferred.pipe() is deprecated"),a.Deferred(function(c){a.each(y,function(f,g){var h=a.isFunction(b[f])&&b[f];d[g[1]](function(){var b=h&&h.apply(this,arguments);b&&a.isFunction(b.promise)?b.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[g[0]+"With"](this===e?c.promise():this,h?[b]:arguments)})}),b=null}).promise()},b&&b.call(d,d),d}}(jQuery,window);
/*
 * @license jQuery Breakpoints | MIT | Jerry Low | https://www.github.com/jerrylow/breakpoints
 */

(function($) {
  var Breakpoints = function(el, options) {
    var _ = this;

    _.n = "breakpoints";
    _.settings = {};
    _.currentBp = null;

    _.getBreakpoint = function() {
      var winW = _windowWidth();
      var bps = _.settings.breakpoints;
      var bpName;

      bps.forEach(function(bp) {
        if (winW >= bp.width) {
          bpName = bp.name;
        }
      });

      // Fallback to largest breakpoint.
      if (!bpName) {
        bpName = bps[bps.length - 1].name;
      }

      return bpName;
    };

    _.getBreakpointWidth = function(bpName) {
      var bps = _.settings.breakpoints;
      var bpWidth;

      bps.forEach(function(bp) {
        if (bpName == bp.name) {
          bpWidth = bp.width;
        }
      });

      return bpWidth;
    };

    _.compareCheck = function(check, checkBpName, callback) {
      var winW = _windowWidth();
      var bps = _.settings.breakpoints;
      var bpWidth = _.getBreakpointWidth(checkBpName);
      var isBp = false;

      switch (check) {
        case "lessThan":
          isBp = winW < bpWidth;
          break;
        case "lessEqualTo":
          isBp = winW <= bpWidth;
          break;
        case "greaterThan":
          isBp = winW > bpWidth;
          break;
        case "greaterEqualTo":
          isBp = winW > bpWidth;
          break;
        case "inside":
          var bpIndex = bps.findIndex(function(bp) {
            return bp.name === checkBpName;
          });

          if (bpIndex === bps.length - 1) {
            isBp = winW > bpWidth;
          } else {
            var nextBpWidth = _.getBreakpointWidth(bps[bpIndex + 1].name);
            isBp = winW >= bpWidth && winW < nextBpWidth;
          }
          break;
      }

      if (isBp) {
        callback();
      }
    };

    _.destroy = function() {
      $(window).unbind(_.n);
    };

    var _compareTrigger = function() {
      var winW = _windowWidth();
      var bps = _.settings.breakpoints;
      var currentBp = _.currentBp;

      bps.forEach(function(bp) {
        if (currentBp === bp.name) {
          if (!bp.inside) {
            $(window).trigger('inside-' + bp.name);
            bp.inside = true;
          }
        } else {
          bp.inside = false;
        }

        if (winW < bp.width) {
          if (!bp.less) {
            $(window).trigger('lessThan-' + bp.name);
            bp.less = true;
            bp.greater = false;
            bp.greaterEqual = false;
          }
        }

        if (winW >= bp.width) {
          if (!bp.greaterEqual) {
            $(window).trigger('greaterEqualTo-' + bp.name);
            bp.greaterEqual = true;
            bp.less = false;
          }

          if (winW > bp.width) {
            if (!bp.greater) {
              $(window).trigger('greaterThan-' + bp.name);
              bp.greater = true;
              bp.less = false;
            }
          }
        }
      });
    };

    var _windowWidth = function() {
      var win = $(window);

      if (_.outerWidth) {
        return win.outerWidth();
      }

      return win.width();
    }

    var _resizeCallback = function() {
      var newBp = _.getBreakpoint();

      if (newBp !== _.currentBp) {
        $(window).trigger({
          "type" : "breakpoint-change",
          "from" : _.currentBp,
          "to" : newBp
        });

        _.currentBp = newBp;
      }
    };

    // Initiate
    var settings = $.extend({}, $.fn.breakpoints.defaults, options);
    _.settings = {
      breakpoints: settings.breakpoints,
      buffer: settings.buffer,
      triggerOnInit: settings.triggerOnInit,
      outerWidth: settings.outerWidth
    };

    el.data(_.n, this);
    _.currentBp = _.getBreakpoint();

    var resizeThresholdTimerId = null;

    if ($.isFunction($(window).on)) {
      $(window).on("resize." + _.n, function(e) {
        if (resizeThresholdTimerId) {
          clearTimeout(resizeThresholdTimerId);
        }

        resizeThresholdTimerId = setTimeout(function(e) {
          _resizeCallback();
          _compareTrigger();
        }, _.settings.buffer);
      });
    }

    if (_.settings.triggerOnInit) {
      setTimeout(function() {
        $(window).trigger({
          "type": "breakpoint-change",
          "from": _.currentBp,
          "to": _.currentBp,
          "initialInit": true
        });
      }, _.settings.buffer);
    }

    setTimeout(function() {
      _compareTrigger();
    }, 0);
  };

  $.fn.breakpoints = function(method, arg1, arg2) {
    if (this.data("breakpoints")) {
      var thisBp = this.data("breakpoints");
      var compareMethods = [
        "lessThan",
        "lessEqualTo",
        "greaterThan",
        "greaterEqualTo",
        "inside"
      ];

      if (method === "getBreakpoint") {
        return thisBp.getBreakpoint();
      } else if (method === "getBreakpointWidth") {
        return thisBp.getBreakpointWidth(arg1);
      } else if (compareMethods.includes(method)) {
        return thisBp.compareCheck(method, arg1, arg2);
      } else if (method === "destroy") {
        thisBp.destroy();
      }

      return;
    }

    new Breakpoints(this, method);
  };

  $.fn.breakpoints.defaults = {
    breakpoints: [
      {"name": "xs", "width": 0},
      {"name": "sm", "width": 768},
      {"name" : "md", "width": 992},
      {"name" : "lg", "width": 1200}
    ],
    buffer: 300,
    triggerOnInit: false,
    outerWidth: false
  };
})(jQuery);
/*
* jquery-match-height 0.7.0 by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=-1,o=-1,i=function(t){return parseFloat(t)||0},a=function(e){var o=1,a=t(e),n=null,r=[];return a.each(function(){var e=t(this),a=e.offset().top-i(e.css("margin-top")),s=r.length>0?r[r.length-1]:null;null===s?r.push(e):Math.floor(Math.abs(n-a))<=o?r[r.length-1]=s.add(e):r.push(e),n=a}),r},n=function(e){var o={
byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof e?t.extend(o,e):("boolean"==typeof e?o.byRow=e:"remove"===e&&(o.remove=!0),o)},r=t.fn.matchHeight=function(e){var o=n(e);if(o.remove){var i=this;return this.css(o.property,""),t.each(r._groups,function(t,e){e.elements=e.elements.not(i)}),this}return this.length<=1&&!o.target?this:(r._groups.push({elements:this,options:o}),r._apply(this,o),this)};r.version="0.7.0",r._groups=[],r._throttle=80,r._maintainScroll=!1,r._beforeUpdate=null,
r._afterUpdate=null,r._rows=a,r._parse=i,r._parseOptions=n,r._apply=function(e,o){var s=n(o),h=t(e),l=[h],c=t(window).scrollTop(),p=t("html").outerHeight(!0),d=h.parents().filter(":hidden");return d.each(function(){var e=t(this);e.data("style-cache",e.attr("style"))}),d.css("display","block"),s.byRow&&!s.target&&(h.each(function(){var e=t(this),o=e.css("display");"inline-block"!==o&&"flex"!==o&&"inline-flex"!==o&&(o="block"),e.data("style-cache",e.attr("style")),e.css({display:o,"padding-top":"0",
"padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),l=a(h),h.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||"")})),t.each(l,function(e,o){var a=t(o),n=0;if(s.target)n=s.target.outerHeight(!1);else{if(s.byRow&&a.length<=1)return void a.css(s.property,"");a.each(function(){var e=t(this),o=e.attr("style"),i=e.css("display");"inline-block"!==i&&"flex"!==i&&"inline-flex"!==i&&(i="block");var a={
display:i};a[s.property]="",e.css(a),e.outerHeight(!1)>n&&(n=e.outerHeight(!1)),o?e.attr("style",o):e.css("display","")})}a.each(function(){var e=t(this),o=0;s.target&&e.is(s.target)||("border-box"!==e.css("box-sizing")&&(o+=i(e.css("border-top-width"))+i(e.css("border-bottom-width")),o+=i(e.css("padding-top"))+i(e.css("padding-bottom"))),e.css(s.property,n-o+"px"))})}),d.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||null)}),r._maintainScroll&&t(window).scrollTop(c/p*t("html").outerHeight(!0)),
this},r._applyDataApi=function(){var e={};t("[data-match-height], [data-mh]").each(function(){var o=t(this),i=o.attr("data-mh")||o.attr("data-match-height");i in e?e[i]=e[i].add(o):e[i]=o}),t.each(e,function(){this.matchHeight(!0)})};var s=function(e){r._beforeUpdate&&r._beforeUpdate(e,r._groups),t.each(r._groups,function(){r._apply(this.elements,this.options)}),r._afterUpdate&&r._afterUpdate(e,r._groups)};r._update=function(i,a){if(a&&"resize"===a.type){var n=t(window).width();if(n===e)return;e=n;
}i?-1===o&&(o=setTimeout(function(){s(a),o=-1},r._throttle)):s(a)},t(r._applyDataApi),t(window).bind("load",function(t){r._update(!1,t)}),t(window).bind("resize orientationchange",function(t){r._update(!0,t)})});

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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5taWdyYXRlLm1pbi5qcyIsImpxdWVyeS5icmVha3BvaW50cy5qcyIsImpxdWVyeS5tYXRjaEhlaWdodC1taW4uanMiLCJzY3JpcHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBqUXVlcnkgTWlncmF0ZSB2My4wLjAgfCAoYykgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyB8IGpxdWVyeS5vcmcvbGljZW5zZSAqL1xuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGpRdWVyeS5taWdyYXRlTXV0ZSYmKGpRdWVyeS5taWdyYXRlTXV0ZT0hMCksZnVuY3Rpb24oYSxiKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBjKGMpe3ZhciBkPWIuY29uc29sZTtlW2NdfHwoZVtjXT0hMCxhLm1pZ3JhdGVXYXJuaW5ncy5wdXNoKGMpLGQmJmQud2FybiYmIWEubWlncmF0ZU11dGUmJihkLndhcm4oXCJKUU1JR1JBVEU6IFwiK2MpLGEubWlncmF0ZVRyYWNlJiZkLnRyYWNlJiZkLnRyYWNlKCkpKX1mdW5jdGlvbiBkKGEsYixkLGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLGIse2NvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBjKGUpLGR9fSl9YS5taWdyYXRlVmVyc2lvbj1cIjMuMC4wXCIsZnVuY3Rpb24oKXt2YXIgYz1iLmNvbnNvbGUmJmIuY29uc29sZS5sb2cmJmZ1bmN0aW9uKCl7Yi5jb25zb2xlLmxvZy5hcHBseShiLmNvbnNvbGUsYXJndW1lbnRzKX0sZD0vXlsxMl1cXC4vO2MmJihhJiYhZC50ZXN0KGEuZm4uanF1ZXJ5KXx8YyhcIkpRTUlHUkFURTogalF1ZXJ5IDMuMC4wKyBSRVFVSVJFRFwiKSxhLm1pZ3JhdGVXYXJuaW5ncyYmYyhcIkpRTUlHUkFURTogTWlncmF0ZSBwbHVnaW4gbG9hZGVkIG11bHRpcGxlIHRpbWVzXCIpLGMoXCJKUU1JR1JBVEU6IE1pZ3JhdGUgaXMgaW5zdGFsbGVkXCIrKGEubWlncmF0ZU11dGU/XCJcIjpcIiB3aXRoIGxvZ2dpbmcgYWN0aXZlXCIpK1wiLCB2ZXJzaW9uIFwiK2EubWlncmF0ZVZlcnNpb24pKX0oKTt2YXIgZT17fTthLm1pZ3JhdGVXYXJuaW5ncz1bXSx2b2lkIDA9PT1hLm1pZ3JhdGVUcmFjZSYmKGEubWlncmF0ZVRyYWNlPSEwKSxhLm1pZ3JhdGVSZXNldD1mdW5jdGlvbigpe2U9e30sYS5taWdyYXRlV2FybmluZ3MubGVuZ3RoPTB9LFwiQmFja0NvbXBhdFwiPT09ZG9jdW1lbnQuY29tcGF0TW9kZSYmYyhcImpRdWVyeSBpcyBub3QgY29tcGF0aWJsZSB3aXRoIFF1aXJrcyBNb2RlXCIpO3ZhciBmPWEuZm4uaW5pdCxnPWEuaXNOdW1lcmljLGg9YS5maW5kLGk9L1xcWyhcXHMqWy1cXHddK1xccyopKFt+fF4kKl0/PSlcXHMqKFstXFx3I10qPyNbLVxcdyNdKilcXHMqXFxdLyxqPS9cXFsoXFxzKlstXFx3XStcXHMqKShbfnxeJCpdPz0pXFxzKihbLVxcdyNdKj8jWy1cXHcjXSopXFxzKlxcXS9nO2EuZm4uaW5pdD1mdW5jdGlvbihhKXt2YXIgYj1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhJiZcIiNcIj09PWEmJihjKFwialF1ZXJ5KCAnIycgKSBpcyBub3QgYSB2YWxpZCBzZWxlY3RvclwiKSxiWzBdPVtdKSxmLmFwcGx5KHRoaXMsYil9LGEuZm4uaW5pdC5wcm90b3R5cGU9YS5mbixhLmZpbmQ9ZnVuY3Rpb24oYSl7dmFyIGI9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtpZihcInN0cmluZ1wiPT10eXBlb2YgYSYmaS50ZXN0KGEpKXRyeXtkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGEpfWNhdGNoKGQpe2E9YS5yZXBsYWNlKGosZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuXCJbXCIrYitjKydcIicrZCsnXCJdJ30pO3RyeXtkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGEpLGMoXCJBdHRyaWJ1dGUgc2VsZWN0b3Igd2l0aCAnIycgbXVzdCBiZSBxdW90ZWQ6IFwiK2JbMF0pLGJbMF09YX1jYXRjaChlKXtjKFwiQXR0cmlidXRlIHNlbGVjdG9yIHdpdGggJyMnIHdhcyBub3QgZml4ZWQ6IFwiK2JbMF0pfX1yZXR1cm4gaC5hcHBseSh0aGlzLGIpfTt2YXIgaztmb3IoayBpbiBoKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChoLGspJiYoYS5maW5kW2tdPWhba10pO2EuZm4uc2l6ZT1mdW5jdGlvbigpe3JldHVybiBjKFwialF1ZXJ5LmZuLnNpemUoKSBpcyBkZXByZWNhdGVkOyB1c2UgdGhlIC5sZW5ndGggcHJvcGVydHlcIiksdGhpcy5sZW5ndGh9LGEucGFyc2VKU09OPWZ1bmN0aW9uKCl7cmV0dXJuIGMoXCJqUXVlcnkucGFyc2VKU09OIGlzIGRlcHJlY2F0ZWQ7IHVzZSBKU09OLnBhcnNlXCIpLEpTT04ucGFyc2UuYXBwbHkobnVsbCxhcmd1bWVudHMpfSxhLmlzTnVtZXJpYz1mdW5jdGlvbihiKXtmdW5jdGlvbiBkKGIpe3ZhciBjPWImJmIudG9TdHJpbmcoKTtyZXR1cm4hYS5pc0FycmF5KGIpJiZjLXBhcnNlRmxvYXQoYykrMT49MH12YXIgZT1nKGIpLGY9ZChiKTtyZXR1cm4gZSE9PWYmJmMoXCJqUXVlcnkuaXNOdW1lcmljKCkgc2hvdWxkIG5vdCBiZSBjYWxsZWQgb24gY29uc3RydWN0ZWQgb2JqZWN0c1wiKSxmfSxkKGEsXCJ1bmlxdWVcIixhLnVuaXF1ZVNvcnQsXCJqUXVlcnkudW5pcXVlIGlzIGRlcHJlY2F0ZWQsIHVzZSBqUXVlcnkudW5pcXVlU29ydFwiKSxkKGEuZXhwcixcImZpbHRlcnNcIixhLmV4cHIucHNldWRvcyxcImpRdWVyeS5leHByLmZpbHRlcnMgaXMgbm93IGpRdWVyeS5leHByLnBzZXVkb3NcIiksZChhLmV4cHIsXCI6XCIsYS5leHByLnBzZXVkb3MsJ2pRdWVyeS5leHByW1wiOlwiXSBpcyBub3cgalF1ZXJ5LmV4cHIucHNldWRvcycpO3ZhciBsPWEuYWpheDthLmFqYXg9ZnVuY3Rpb24oKXt2YXIgYT1sLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtyZXR1cm4gYS5wcm9taXNlJiYoZChhLFwic3VjY2Vzc1wiLGEuZG9uZSxcImpRWEhSLnN1Y2Nlc3MgaXMgZGVwcmVjYXRlZCBhbmQgcmVtb3ZlZFwiKSxkKGEsXCJlcnJvclwiLGEuZmFpbCxcImpRWEhSLmVycm9yIGlzIGRlcHJlY2F0ZWQgYW5kIHJlbW92ZWRcIiksZChhLFwiY29tcGxldGVcIixhLmFsd2F5cyxcImpRWEhSLmNvbXBsZXRlIGlzIGRlcHJlY2F0ZWQgYW5kIHJlbW92ZWRcIikpLGF9O3ZhciBtPWEuZm4ucmVtb3ZlQXR0cixuPWEuZm4udG9nZ2xlQ2xhc3Msbz0vXFxTKy9nO2EuZm4ucmVtb3ZlQXR0cj1mdW5jdGlvbihiKXt2YXIgZD10aGlzO3JldHVybiBhLmVhY2goYi5tYXRjaChvKSxmdW5jdGlvbihiLGUpe2EuZXhwci5tYXRjaC5ib29sLnRlc3QoZSkmJihjKFwialF1ZXJ5LmZuLnJlbW92ZUF0dHIgbm8gbG9uZ2VyIHNldHMgYm9vbGVhbiBwcm9wZXJ0aWVzOiBcIitlKSxkLnByb3AoZSwhMSkpfSksbS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGEuZm4udG9nZ2xlQ2xhc3M9ZnVuY3Rpb24oYil7cmV0dXJuIHZvaWQgMCE9PWImJlwiYm9vbGVhblwiIT10eXBlb2YgYj9uLmFwcGx5KHRoaXMsYXJndW1lbnRzKTooYyhcImpRdWVyeS5mbi50b2dnbGVDbGFzcyggYm9vbGVhbiApIGlzIGRlcHJlY2F0ZWRcIiksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9dGhpcy5nZXRBdHRyaWJ1dGUmJnRoaXMuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIil8fFwiXCI7YyYmYS5kYXRhKHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIsYyksdGhpcy5zZXRBdHRyaWJ1dGUmJnRoaXMuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixjfHxiPT09ITE/XCJcIjphLmRhdGEodGhpcyxcIl9fY2xhc3NOYW1lX19cIil8fFwiXCIpfSkpfTt2YXIgcD0hMTthLnN3YXAmJmEuZWFjaChbXCJoZWlnaHRcIixcIndpZHRoXCIsXCJyZWxpYWJsZU1hcmdpblJpZ2h0XCJdLGZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5jc3NIb29rc1tjXSYmYS5jc3NIb29rc1tjXS5nZXQ7ZCYmKGEuY3NzSG9va3NbY10uZ2V0PWZ1bmN0aW9uKCl7dmFyIGE7cmV0dXJuIHA9ITAsYT1kLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxwPSExLGF9KX0pLGEuc3dhcD1mdW5jdGlvbihhLGIsZCxlKXt2YXIgZixnLGg9e307cHx8YyhcImpRdWVyeS5zd2FwKCkgaXMgdW5kb2N1bWVudGVkIGFuZCBkZXByZWNhdGVkXCIpO2ZvcihnIGluIGIpaFtnXT1hLnN0eWxlW2ddLGEuc3R5bGVbZ109YltnXTtmPWQuYXBwbHkoYSxlfHxbXSk7Zm9yKGcgaW4gYilhLnN0eWxlW2ddPWhbZ107cmV0dXJuIGZ9O3ZhciBxPWEuZGF0YTthLmRhdGE9ZnVuY3Rpb24oYixkLGUpe3ZhciBmO3JldHVybiBkJiZkIT09YS5jYW1lbENhc2UoZCkmJihmPWEuaGFzRGF0YShiKSYmcS5jYWxsKHRoaXMsYiksZiYmZCBpbiBmKT8oYyhcImpRdWVyeS5kYXRhKCkgYWx3YXlzIHNldHMvZ2V0cyBjYW1lbENhc2VkIG5hbWVzOiBcIitkKSxhcmd1bWVudHMubGVuZ3RoPjImJihmW2RdPWUpLGZbZF0pOnEuYXBwbHkodGhpcyxhcmd1bWVudHMpfTt2YXIgcj1hLlR3ZWVuLnByb3RvdHlwZS5ydW47YS5Ud2Vlbi5wcm90b3R5cGUucnVuPWZ1bmN0aW9uKGIpe2EuZWFzaW5nW3RoaXMuZWFzaW5nXS5sZW5ndGg+MSYmKGMoJ2Vhc2luZyBmdW5jdGlvbiBcImpRdWVyeS5lYXNpbmcuJyt0aGlzLmVhc2luZy50b1N0cmluZygpKydcIiBzaG91bGQgdXNlIG9ubHkgZmlyc3QgYXJndW1lbnQnKSxhLmVhc2luZ1t0aGlzLmVhc2luZ109YS5lYXNpbmdbdGhpcy5lYXNpbmddLmJpbmQoYS5lYXNpbmcsYix0aGlzLm9wdGlvbnMuZHVyYXRpb24qYiwwLDEsdGhpcy5vcHRpb25zLmR1cmF0aW9uKSksci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O3ZhciBzPWEuZm4ubG9hZCx0PWEuZXZlbnQuZml4O2EuZXZlbnQucHJvcHM9W10sYS5ldmVudC5maXhIb29rcz17fSxhLmV2ZW50LmZpeD1mdW5jdGlvbihiKXt2YXIgZCxlPWIudHlwZSxmPXRoaXMuZml4SG9va3NbZV0sZz1hLmV2ZW50LnByb3BzO2lmKGcubGVuZ3RoKWZvcihjKFwialF1ZXJ5LmV2ZW50LnByb3BzIGFyZSBkZXByZWNhdGVkIGFuZCByZW1vdmVkOiBcIitnLmpvaW4oKSk7Zy5sZW5ndGg7KWEuZXZlbnQuYWRkUHJvcChnLnBvcCgpKTtpZihmJiYhZi5fbWlncmF0ZWRfJiYoZi5fbWlncmF0ZWRfPSEwLGMoXCJqUXVlcnkuZXZlbnQuZml4SG9va3MgYXJlIGRlcHJlY2F0ZWQgYW5kIHJlbW92ZWQ6IFwiK2UpLChnPWYucHJvcHMpJiZnLmxlbmd0aCkpZm9yKDtnLmxlbmd0aDspYS5ldmVudC5hZGRQcm9wKGcucG9wKCkpO3JldHVybiBkPXQuY2FsbCh0aGlzLGIpLGYmJmYuZmlsdGVyP2YuZmlsdGVyKGQsYik6ZH0sYS5lYWNoKFtcImxvYWRcIixcInVubG9hZFwiLFwiZXJyb3JcIl0sZnVuY3Rpb24oYixkKXthLmZuW2RdPWZ1bmN0aW9uKCl7dmFyIGE9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApO3JldHVyblwibG9hZFwiPT09ZCYmXCJzdHJpbmdcIj09dHlwZW9mIGFbMF0/cy5hcHBseSh0aGlzLGEpOihjKFwialF1ZXJ5LmZuLlwiK2QrXCIoKSBpcyBkZXByZWNhdGVkXCIpLGEuc3BsaWNlKDAsMCxkKSxhcmd1bWVudHMubGVuZ3RoP3RoaXMub24uYXBwbHkodGhpcyxhKToodGhpcy50cmlnZ2VySGFuZGxlci5hcHBseSh0aGlzLGEpLHRoaXMpKX19KSxhKGZ1bmN0aW9uKCl7YShkb2N1bWVudCkudHJpZ2dlckhhbmRsZXIoXCJyZWFkeVwiKX0pLGEuZXZlbnQuc3BlY2lhbC5yZWFkeT17c2V0dXA6ZnVuY3Rpb24oKXt0aGlzPT09ZG9jdW1lbnQmJmMoXCIncmVhZHknIGV2ZW50IGlzIGRlcHJlY2F0ZWRcIil9fSxhLmZuLmV4dGVuZCh7YmluZDpmdW5jdGlvbihhLGIsZCl7cmV0dXJuIGMoXCJqUXVlcnkuZm4uYmluZCgpIGlzIGRlcHJlY2F0ZWRcIiksdGhpcy5vbihhLG51bGwsYixkKX0sdW5iaW5kOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGMoXCJqUXVlcnkuZm4udW5iaW5kKCkgaXMgZGVwcmVjYXRlZFwiKSx0aGlzLm9mZihhLG51bGwsYil9LGRlbGVnYXRlOmZ1bmN0aW9uKGEsYixkLGUpe3JldHVybiBjKFwialF1ZXJ5LmZuLmRlbGVnYXRlKCkgaXMgZGVwcmVjYXRlZFwiKSx0aGlzLm9uKGIsYSxkLGUpfSx1bmRlbGVnYXRlOmZ1bmN0aW9uKGEsYixkKXtyZXR1cm4gYyhcImpRdWVyeS5mbi51bmRlbGVnYXRlKCkgaXMgZGVwcmVjYXRlZFwiKSwxPT09YXJndW1lbnRzLmxlbmd0aD90aGlzLm9mZihhLFwiKipcIik6dGhpcy5vZmYoYixhfHxcIioqXCIsZCl9fSk7dmFyIHU9YS5mbi5vZmZzZXQ7YS5mbi5vZmZzZXQ9ZnVuY3Rpb24oKXt2YXIgYixkPXRoaXNbMF0sZT17dG9wOjAsbGVmdDowfTtyZXR1cm4gZCYmZC5ub2RlVHlwZT8oYj0oZC5vd25lckRvY3VtZW50fHxkb2N1bWVudCkuZG9jdW1lbnRFbGVtZW50LGEuY29udGFpbnMoYixkKT91LmFwcGx5KHRoaXMsYXJndW1lbnRzKTooYyhcImpRdWVyeS5mbi5vZmZzZXQoKSByZXF1aXJlcyBhbiBlbGVtZW50IGNvbm5lY3RlZCB0byBhIGRvY3VtZW50XCIpLGUpKTooYyhcImpRdWVyeS5mbi5vZmZzZXQoKSByZXF1aXJlcyBhIHZhbGlkIERPTSBlbGVtZW50XCIpLGUpfTt2YXIgdj1hLnBhcmFtO2EucGFyYW09ZnVuY3Rpb24oYixkKXt2YXIgZT1hLmFqYXhTZXR0aW5ncyYmYS5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWw7cmV0dXJuIHZvaWQgMD09PWQmJmUmJihjKFwialF1ZXJ5LnBhcmFtKCkgbm8gbG9uZ2VyIHVzZXMgalF1ZXJ5LmFqYXhTZXR0aW5ncy50cmFkaXRpb25hbFwiKSxkPWUpLHYuY2FsbCh0aGlzLGIsZCl9O3ZhciB3PWEuZm4uYW5kU2VsZnx8YS5mbi5hZGRCYWNrO2EuZm4uYW5kU2VsZj1mdW5jdGlvbigpe3JldHVybiBjKFwialF1ZXJ5LmZuLmFuZFNlbGYoKSByZXBsYWNlZCBieSBqUXVlcnkuZm4uYWRkQmFjaygpXCIpLHcuYXBwbHkodGhpcyxhcmd1bWVudHMpfTt2YXIgeD1hLkRlZmVycmVkLHk9W1tcInJlc29sdmVcIixcImRvbmVcIixhLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLGEuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXCJyZXNvbHZlZFwiXSxbXCJyZWplY3RcIixcImZhaWxcIixhLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLGEuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXCJyZWplY3RlZFwiXSxbXCJub3RpZnlcIixcInByb2dyZXNzXCIsYS5DYWxsYmFja3MoXCJtZW1vcnlcIiksYS5DYWxsYmFja3MoXCJtZW1vcnlcIildXTthLkRlZmVycmVkPWZ1bmN0aW9uKGIpe3ZhciBkPXgoKSxlPWQucHJvbWlzZSgpO3JldHVybiBkLnBpcGU9ZS5waXBlPWZ1bmN0aW9uKCl7dmFyIGI9YXJndW1lbnRzO3JldHVybiBjKFwiZGVmZXJyZWQucGlwZSgpIGlzIGRlcHJlY2F0ZWRcIiksYS5EZWZlcnJlZChmdW5jdGlvbihjKXthLmVhY2goeSxmdW5jdGlvbihmLGcpe3ZhciBoPWEuaXNGdW5jdGlvbihiW2ZdKSYmYltmXTtkW2dbMV1dKGZ1bmN0aW9uKCl7dmFyIGI9aCYmaC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7YiYmYS5pc0Z1bmN0aW9uKGIucHJvbWlzZSk/Yi5wcm9taXNlKCkuZG9uZShjLnJlc29sdmUpLmZhaWwoYy5yZWplY3QpLnByb2dyZXNzKGMubm90aWZ5KTpjW2dbMF0rXCJXaXRoXCJdKHRoaXM9PT1lP2MucHJvbWlzZSgpOnRoaXMsaD9bYl06YXJndW1lbnRzKX0pfSksYj1udWxsfSkucHJvbWlzZSgpfSxiJiZiLmNhbGwoZCxkKSxkfX0oalF1ZXJ5LHdpbmRvdyk7IiwiLypcbiAqIEBsaWNlbnNlIGpRdWVyeSBCcmVha3BvaW50cyB8IE1JVCB8IEplcnJ5IExvdyB8IGh0dHBzOi8vd3d3LmdpdGh1Yi5jb20vamVycnlsb3cvYnJlYWtwb2ludHNcbiAqL1xuXG4oZnVuY3Rpb24oJCkge1xuICB2YXIgQnJlYWtwb2ludHMgPSBmdW5jdGlvbihlbCwgb3B0aW9ucykge1xuICAgIHZhciBfID0gdGhpcztcblxuICAgIF8ubiA9IFwiYnJlYWtwb2ludHNcIjtcbiAgICBfLnNldHRpbmdzID0ge307XG4gICAgXy5jdXJyZW50QnAgPSBudWxsO1xuXG4gICAgXy5nZXRCcmVha3BvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgd2luVyA9IF93aW5kb3dXaWR0aCgpO1xuICAgICAgdmFyIGJwcyA9IF8uc2V0dGluZ3MuYnJlYWtwb2ludHM7XG4gICAgICB2YXIgYnBOYW1lO1xuXG4gICAgICBicHMuZm9yRWFjaChmdW5jdGlvbihicCkge1xuICAgICAgICBpZiAod2luVyA+PSBicC53aWR0aCkge1xuICAgICAgICAgIGJwTmFtZSA9IGJwLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBGYWxsYmFjayB0byBsYXJnZXN0IGJyZWFrcG9pbnQuXG4gICAgICBpZiAoIWJwTmFtZSkge1xuICAgICAgICBicE5hbWUgPSBicHNbYnBzLmxlbmd0aCAtIDFdLm5hbWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBicE5hbWU7XG4gICAgfTtcblxuICAgIF8uZ2V0QnJlYWtwb2ludFdpZHRoID0gZnVuY3Rpb24oYnBOYW1lKSB7XG4gICAgICB2YXIgYnBzID0gXy5zZXR0aW5ncy5icmVha3BvaW50cztcbiAgICAgIHZhciBicFdpZHRoO1xuXG4gICAgICBicHMuZm9yRWFjaChmdW5jdGlvbihicCkge1xuICAgICAgICBpZiAoYnBOYW1lID09IGJwLm5hbWUpIHtcbiAgICAgICAgICBicFdpZHRoID0gYnAud2lkdGg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYnBXaWR0aDtcbiAgICB9O1xuXG4gICAgXy5jb21wYXJlQ2hlY2sgPSBmdW5jdGlvbihjaGVjaywgY2hlY2tCcE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgd2luVyA9IF93aW5kb3dXaWR0aCgpO1xuICAgICAgdmFyIGJwcyA9IF8uc2V0dGluZ3MuYnJlYWtwb2ludHM7XG4gICAgICB2YXIgYnBXaWR0aCA9IF8uZ2V0QnJlYWtwb2ludFdpZHRoKGNoZWNrQnBOYW1lKTtcbiAgICAgIHZhciBpc0JwID0gZmFsc2U7XG5cbiAgICAgIHN3aXRjaCAoY2hlY2spIHtcbiAgICAgICAgY2FzZSBcImxlc3NUaGFuXCI6XG4gICAgICAgICAgaXNCcCA9IHdpblcgPCBicFdpZHRoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibGVzc0VxdWFsVG9cIjpcbiAgICAgICAgICBpc0JwID0gd2luVyA8PSBicFdpZHRoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZ3JlYXRlclRoYW5cIjpcbiAgICAgICAgICBpc0JwID0gd2luVyA+IGJwV2lkdGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJncmVhdGVyRXF1YWxUb1wiOlxuICAgICAgICAgIGlzQnAgPSB3aW5XID4gYnBXaWR0aDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImluc2lkZVwiOlxuICAgICAgICAgIHZhciBicEluZGV4ID0gYnBzLmZpbmRJbmRleChmdW5jdGlvbihicCkge1xuICAgICAgICAgICAgcmV0dXJuIGJwLm5hbWUgPT09IGNoZWNrQnBOYW1lO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKGJwSW5kZXggPT09IGJwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBpc0JwID0gd2luVyA+IGJwV2lkdGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXh0QnBXaWR0aCA9IF8uZ2V0QnJlYWtwb2ludFdpZHRoKGJwc1ticEluZGV4ICsgMV0ubmFtZSk7XG4gICAgICAgICAgICBpc0JwID0gd2luVyA+PSBicFdpZHRoICYmIHdpblcgPCBuZXh0QnBXaWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0JwKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF8uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgJCh3aW5kb3cpLnVuYmluZChfLm4pO1xuICAgIH07XG5cbiAgICB2YXIgX2NvbXBhcmVUcmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgd2luVyA9IF93aW5kb3dXaWR0aCgpO1xuICAgICAgdmFyIGJwcyA9IF8uc2V0dGluZ3MuYnJlYWtwb2ludHM7XG4gICAgICB2YXIgY3VycmVudEJwID0gXy5jdXJyZW50QnA7XG5cbiAgICAgIGJwcy5mb3JFYWNoKGZ1bmN0aW9uKGJwKSB7XG4gICAgICAgIGlmIChjdXJyZW50QnAgPT09IGJwLm5hbWUpIHtcbiAgICAgICAgICBpZiAoIWJwLmluc2lkZSkge1xuICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2luc2lkZS0nICsgYnAubmFtZSk7XG4gICAgICAgICAgICBicC5pbnNpZGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicC5pbnNpZGUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aW5XIDwgYnAud2lkdGgpIHtcbiAgICAgICAgICBpZiAoIWJwLmxlc3MpIHtcbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdsZXNzVGhhbi0nICsgYnAubmFtZSk7XG4gICAgICAgICAgICBicC5sZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIGJwLmdyZWF0ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIGJwLmdyZWF0ZXJFcXVhbCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aW5XID49IGJwLndpZHRoKSB7XG4gICAgICAgICAgaWYgKCFicC5ncmVhdGVyRXF1YWwpIHtcbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdncmVhdGVyRXF1YWxUby0nICsgYnAubmFtZSk7XG4gICAgICAgICAgICBicC5ncmVhdGVyRXF1YWwgPSB0cnVlO1xuICAgICAgICAgICAgYnAubGVzcyA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh3aW5XID4gYnAud2lkdGgpIHtcbiAgICAgICAgICAgIGlmICghYnAuZ3JlYXRlcikge1xuICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignZ3JlYXRlclRoYW4tJyArIGJwLm5hbWUpO1xuICAgICAgICAgICAgICBicC5ncmVhdGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnAubGVzcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBfd2luZG93V2lkdGggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB3aW4gPSAkKHdpbmRvdyk7XG5cbiAgICAgIGlmIChfLm91dGVyV2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIHdpbi5vdXRlcldpZHRoKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB3aW4ud2lkdGgoKTtcbiAgICB9XG5cbiAgICB2YXIgX3Jlc2l6ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbmV3QnAgPSBfLmdldEJyZWFrcG9pbnQoKTtcblxuICAgICAgaWYgKG5ld0JwICE9PSBfLmN1cnJlbnRCcCkge1xuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcih7XG4gICAgICAgICAgXCJ0eXBlXCIgOiBcImJyZWFrcG9pbnQtY2hhbmdlXCIsXG4gICAgICAgICAgXCJmcm9tXCIgOiBfLmN1cnJlbnRCcCxcbiAgICAgICAgICBcInRvXCIgOiBuZXdCcFxuICAgICAgICB9KTtcblxuICAgICAgICBfLmN1cnJlbnRCcCA9IG5ld0JwO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBJbml0aWF0ZVxuICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCAkLmZuLmJyZWFrcG9pbnRzLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICBfLnNldHRpbmdzID0ge1xuICAgICAgYnJlYWtwb2ludHM6IHNldHRpbmdzLmJyZWFrcG9pbnRzLFxuICAgICAgYnVmZmVyOiBzZXR0aW5ncy5idWZmZXIsXG4gICAgICB0cmlnZ2VyT25Jbml0OiBzZXR0aW5ncy50cmlnZ2VyT25Jbml0LFxuICAgICAgb3V0ZXJXaWR0aDogc2V0dGluZ3Mub3V0ZXJXaWR0aFxuICAgIH07XG5cbiAgICBlbC5kYXRhKF8ubiwgdGhpcyk7XG4gICAgXy5jdXJyZW50QnAgPSBfLmdldEJyZWFrcG9pbnQoKTtcblxuICAgIHZhciByZXNpemVUaHJlc2hvbGRUaW1lcklkID0gbnVsbDtcblxuICAgIGlmICgkLmlzRnVuY3Rpb24oJCh3aW5kb3cpLm9uKSkge1xuICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplLlwiICsgXy5uLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChyZXNpemVUaHJlc2hvbGRUaW1lcklkKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRocmVzaG9sZFRpbWVySWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzaXplVGhyZXNob2xkVGltZXJJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oZSkge1xuICAgICAgICAgIF9yZXNpemVDYWxsYmFjaygpO1xuICAgICAgICAgIF9jb21wYXJlVHJpZ2dlcigpO1xuICAgICAgICB9LCBfLnNldHRpbmdzLmJ1ZmZlcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoXy5zZXR0aW5ncy50cmlnZ2VyT25Jbml0KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcih7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiYnJlYWtwb2ludC1jaGFuZ2VcIixcbiAgICAgICAgICBcImZyb21cIjogXy5jdXJyZW50QnAsXG4gICAgICAgICAgXCJ0b1wiOiBfLmN1cnJlbnRCcCxcbiAgICAgICAgICBcImluaXRpYWxJbml0XCI6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9LCBfLnNldHRpbmdzLmJ1ZmZlcik7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIF9jb21wYXJlVHJpZ2dlcigpO1xuICAgIH0sIDApO1xuICB9O1xuXG4gICQuZm4uYnJlYWtwb2ludHMgPSBmdW5jdGlvbihtZXRob2QsIGFyZzEsIGFyZzIpIHtcbiAgICBpZiAodGhpcy5kYXRhKFwiYnJlYWtwb2ludHNcIikpIHtcbiAgICAgIHZhciB0aGlzQnAgPSB0aGlzLmRhdGEoXCJicmVha3BvaW50c1wiKTtcbiAgICAgIHZhciBjb21wYXJlTWV0aG9kcyA9IFtcbiAgICAgICAgXCJsZXNzVGhhblwiLFxuICAgICAgICBcImxlc3NFcXVhbFRvXCIsXG4gICAgICAgIFwiZ3JlYXRlclRoYW5cIixcbiAgICAgICAgXCJncmVhdGVyRXF1YWxUb1wiLFxuICAgICAgICBcImluc2lkZVwiXG4gICAgICBdO1xuXG4gICAgICBpZiAobWV0aG9kID09PSBcImdldEJyZWFrcG9pbnRcIikge1xuICAgICAgICByZXR1cm4gdGhpc0JwLmdldEJyZWFrcG9pbnQoKTtcbiAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcImdldEJyZWFrcG9pbnRXaWR0aFwiKSB7XG4gICAgICAgIHJldHVybiB0aGlzQnAuZ2V0QnJlYWtwb2ludFdpZHRoKGFyZzEpO1xuICAgICAgfSBlbHNlIGlmIChjb21wYXJlTWV0aG9kcy5pbmNsdWRlcyhtZXRob2QpKSB7XG4gICAgICAgIHJldHVybiB0aGlzQnAuY29tcGFyZUNoZWNrKG1ldGhvZCwgYXJnMSwgYXJnMik7XG4gICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJkZXN0cm95XCIpIHtcbiAgICAgICAgdGhpc0JwLmRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5ldyBCcmVha3BvaW50cyh0aGlzLCBtZXRob2QpO1xuICB9O1xuXG4gICQuZm4uYnJlYWtwb2ludHMuZGVmYXVsdHMgPSB7XG4gICAgYnJlYWtwb2ludHM6IFtcbiAgICAgIHtcIm5hbWVcIjogXCJ4c1wiLCBcIndpZHRoXCI6IDB9LFxuICAgICAge1wibmFtZVwiOiBcInNtXCIsIFwid2lkdGhcIjogNzY4fSxcbiAgICAgIHtcIm5hbWVcIiA6IFwibWRcIiwgXCJ3aWR0aFwiOiA5OTJ9LFxuICAgICAge1wibmFtZVwiIDogXCJsZ1wiLCBcIndpZHRoXCI6IDEyMDB9XG4gICAgXSxcbiAgICBidWZmZXI6IDMwMCxcbiAgICB0cmlnZ2VyT25Jbml0OiBmYWxzZSxcbiAgICBvdXRlcldpZHRoOiBmYWxzZVxuICB9O1xufSkoalF1ZXJ5KTsiLCIvKlxuKiBqcXVlcnktbWF0Y2gtaGVpZ2h0IDAuNy4wIGJ5IEBsaWFicnVcbiogaHR0cDovL2JybS5pby9qcXVlcnktbWF0Y2gtaGVpZ2h0L1xuKiBMaWNlbnNlIE1JVFxuKi9cbiFmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImpxdWVyeVwiXSx0KTpcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz10KHJlcXVpcmUoXCJqcXVlcnlcIikpOnQoalF1ZXJ5KX0oZnVuY3Rpb24odCl7dmFyIGU9LTEsbz0tMSxpPWZ1bmN0aW9uKHQpe3JldHVybiBwYXJzZUZsb2F0KHQpfHwwfSxhPWZ1bmN0aW9uKGUpe3ZhciBvPTEsYT10KGUpLG49bnVsbCxyPVtdO3JldHVybiBhLmVhY2goZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMpLGE9ZS5vZmZzZXQoKS50b3AtaShlLmNzcyhcIm1hcmdpbi10b3BcIikpLHM9ci5sZW5ndGg+MD9yW3IubGVuZ3RoLTFdOm51bGw7bnVsbD09PXM/ci5wdXNoKGUpOk1hdGguZmxvb3IoTWF0aC5hYnMobi1hKSk8PW8/cltyLmxlbmd0aC0xXT1zLmFkZChlKTpyLnB1c2goZSksbj1hfSkscn0sbj1mdW5jdGlvbihlKXt2YXIgbz17XG5ieVJvdzohMCxwcm9wZXJ0eTpcImhlaWdodFwiLHRhcmdldDpudWxsLHJlbW92ZTohMX07cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGU/dC5leHRlbmQobyxlKTooXCJib29sZWFuXCI9PXR5cGVvZiBlP28uYnlSb3c9ZTpcInJlbW92ZVwiPT09ZSYmKG8ucmVtb3ZlPSEwKSxvKX0scj10LmZuLm1hdGNoSGVpZ2h0PWZ1bmN0aW9uKGUpe3ZhciBvPW4oZSk7aWYoby5yZW1vdmUpe3ZhciBpPXRoaXM7cmV0dXJuIHRoaXMuY3NzKG8ucHJvcGVydHksXCJcIiksdC5lYWNoKHIuX2dyb3VwcyxmdW5jdGlvbih0LGUpe2UuZWxlbWVudHM9ZS5lbGVtZW50cy5ub3QoaSl9KSx0aGlzfXJldHVybiB0aGlzLmxlbmd0aDw9MSYmIW8udGFyZ2V0P3RoaXM6KHIuX2dyb3Vwcy5wdXNoKHtlbGVtZW50czp0aGlzLG9wdGlvbnM6b30pLHIuX2FwcGx5KHRoaXMsbyksdGhpcyl9O3IudmVyc2lvbj1cIjAuNy4wXCIsci5fZ3JvdXBzPVtdLHIuX3Rocm90dGxlPTgwLHIuX21haW50YWluU2Nyb2xsPSExLHIuX2JlZm9yZVVwZGF0ZT1udWxsLFxuci5fYWZ0ZXJVcGRhdGU9bnVsbCxyLl9yb3dzPWEsci5fcGFyc2U9aSxyLl9wYXJzZU9wdGlvbnM9bixyLl9hcHBseT1mdW5jdGlvbihlLG8pe3ZhciBzPW4obyksaD10KGUpLGw9W2hdLGM9dCh3aW5kb3cpLnNjcm9sbFRvcCgpLHA9dChcImh0bWxcIikub3V0ZXJIZWlnaHQoITApLGQ9aC5wYXJlbnRzKCkuZmlsdGVyKFwiOmhpZGRlblwiKTtyZXR1cm4gZC5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzKTtlLmRhdGEoXCJzdHlsZS1jYWNoZVwiLGUuYXR0cihcInN0eWxlXCIpKX0pLGQuY3NzKFwiZGlzcGxheVwiLFwiYmxvY2tcIikscy5ieVJvdyYmIXMudGFyZ2V0JiYoaC5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzKSxvPWUuY3NzKFwiZGlzcGxheVwiKTtcImlubGluZS1ibG9ja1wiIT09byYmXCJmbGV4XCIhPT1vJiZcImlubGluZS1mbGV4XCIhPT1vJiYobz1cImJsb2NrXCIpLGUuZGF0YShcInN0eWxlLWNhY2hlXCIsZS5hdHRyKFwic3R5bGVcIikpLGUuY3NzKHtkaXNwbGF5Om8sXCJwYWRkaW5nLXRvcFwiOlwiMFwiLFxuXCJwYWRkaW5nLWJvdHRvbVwiOlwiMFwiLFwibWFyZ2luLXRvcFwiOlwiMFwiLFwibWFyZ2luLWJvdHRvbVwiOlwiMFwiLFwiYm9yZGVyLXRvcC13aWR0aFwiOlwiMFwiLFwiYm9yZGVyLWJvdHRvbS13aWR0aFwiOlwiMFwiLGhlaWdodDpcIjEwMHB4XCIsb3ZlcmZsb3c6XCJoaWRkZW5cIn0pfSksbD1hKGgpLGguZWFjaChmdW5jdGlvbigpe3ZhciBlPXQodGhpcyk7ZS5hdHRyKFwic3R5bGVcIixlLmRhdGEoXCJzdHlsZS1jYWNoZVwiKXx8XCJcIil9KSksdC5lYWNoKGwsZnVuY3Rpb24oZSxvKXt2YXIgYT10KG8pLG49MDtpZihzLnRhcmdldCluPXMudGFyZ2V0Lm91dGVySGVpZ2h0KCExKTtlbHNle2lmKHMuYnlSb3cmJmEubGVuZ3RoPD0xKXJldHVybiB2b2lkIGEuY3NzKHMucHJvcGVydHksXCJcIik7YS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzKSxvPWUuYXR0cihcInN0eWxlXCIpLGk9ZS5jc3MoXCJkaXNwbGF5XCIpO1wiaW5saW5lLWJsb2NrXCIhPT1pJiZcImZsZXhcIiE9PWkmJlwiaW5saW5lLWZsZXhcIiE9PWkmJihpPVwiYmxvY2tcIik7dmFyIGE9e1xuZGlzcGxheTppfTthW3MucHJvcGVydHldPVwiXCIsZS5jc3MoYSksZS5vdXRlckhlaWdodCghMSk+biYmKG49ZS5vdXRlckhlaWdodCghMSkpLG8/ZS5hdHRyKFwic3R5bGVcIixvKTplLmNzcyhcImRpc3BsYXlcIixcIlwiKX0pfWEuZWFjaChmdW5jdGlvbigpe3ZhciBlPXQodGhpcyksbz0wO3MudGFyZ2V0JiZlLmlzKHMudGFyZ2V0KXx8KFwiYm9yZGVyLWJveFwiIT09ZS5jc3MoXCJib3gtc2l6aW5nXCIpJiYobys9aShlLmNzcyhcImJvcmRlci10b3Atd2lkdGhcIikpK2koZS5jc3MoXCJib3JkZXItYm90dG9tLXdpZHRoXCIpKSxvKz1pKGUuY3NzKFwicGFkZGluZy10b3BcIikpK2koZS5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiKSkpLGUuY3NzKHMucHJvcGVydHksbi1vK1wicHhcIikpfSl9KSxkLmVhY2goZnVuY3Rpb24oKXt2YXIgZT10KHRoaXMpO2UuYXR0cihcInN0eWxlXCIsZS5kYXRhKFwic3R5bGUtY2FjaGVcIil8fG51bGwpfSksci5fbWFpbnRhaW5TY3JvbGwmJnQod2luZG93KS5zY3JvbGxUb3AoYy9wKnQoXCJodG1sXCIpLm91dGVySGVpZ2h0KCEwKSksXG50aGlzfSxyLl9hcHBseURhdGFBcGk9ZnVuY3Rpb24oKXt2YXIgZT17fTt0KFwiW2RhdGEtbWF0Y2gtaGVpZ2h0XSwgW2RhdGEtbWhdXCIpLmVhY2goZnVuY3Rpb24oKXt2YXIgbz10KHRoaXMpLGk9by5hdHRyKFwiZGF0YS1taFwiKXx8by5hdHRyKFwiZGF0YS1tYXRjaC1oZWlnaHRcIik7aSBpbiBlP2VbaV09ZVtpXS5hZGQobyk6ZVtpXT1vfSksdC5lYWNoKGUsZnVuY3Rpb24oKXt0aGlzLm1hdGNoSGVpZ2h0KCEwKX0pfTt2YXIgcz1mdW5jdGlvbihlKXtyLl9iZWZvcmVVcGRhdGUmJnIuX2JlZm9yZVVwZGF0ZShlLHIuX2dyb3VwcyksdC5lYWNoKHIuX2dyb3VwcyxmdW5jdGlvbigpe3IuX2FwcGx5KHRoaXMuZWxlbWVudHMsdGhpcy5vcHRpb25zKX0pLHIuX2FmdGVyVXBkYXRlJiZyLl9hZnRlclVwZGF0ZShlLHIuX2dyb3Vwcyl9O3IuX3VwZGF0ZT1mdW5jdGlvbihpLGEpe2lmKGEmJlwicmVzaXplXCI9PT1hLnR5cGUpe3ZhciBuPXQod2luZG93KS53aWR0aCgpO2lmKG49PT1lKXJldHVybjtlPW47XG59aT8tMT09PW8mJihvPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtzKGEpLG89LTF9LHIuX3Rocm90dGxlKSk6cyhhKX0sdChyLl9hcHBseURhdGFBcGkpLHQod2luZG93KS5iaW5kKFwibG9hZFwiLGZ1bmN0aW9uKHQpe3IuX3VwZGF0ZSghMSx0KX0pLHQod2luZG93KS5iaW5kKFwicmVzaXplIG9yaWVudGF0aW9uY2hhbmdlXCIsZnVuY3Rpb24odCl7ci5fdXBkYXRlKCEwLHQpfSl9KTtcbiIsInZhciBpc01vYmlsZSA9IHtcblx0QW5kcm9pZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSk7XG5cdH0sXG5cdEJsYWNrQmVycnk6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpO1xuXHR9LFxuXHRpT1M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpO1xuXHR9LFxuXHRPcGVyYTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL09wZXJhIE1pbmkvaSk7XG5cdH0sXG5cdFdpbmRvd3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9JRU1vYmlsZS9pKTtcblx0fSxcblx0YW55OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKGlzTW9iaWxlLkFuZHJvaWQoKSB8fCBpc01vYmlsZS5CbGFja0JlcnJ5KCkgfHwgaXNNb2JpbGUuaU9TKCkgfHwgaXNNb2JpbGUuT3BlcmEoKSB8fCBpc01vYmlsZS5XaW5kb3dzKCkpO1xuXHR9XG59O1xuXG4oZnVuY3Rpb24oJCkge1xuXG5cdCQoZnVuY3Rpb24oKSB7XG5cblx0XHQkKFwiLmNvbGxhcHNpYmxlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdCQodGhpcykubmV4dCgpLnNsaWRlVG9nZ2xlKFwiZmFzdFwiKTtcblx0XHR9KTtcblxuXG5cdFx0Ly8gQnJlYWtwb2ludHMgZnJvbSBTYXNzIHZhcmlhYmxlczpcblx0XHQvLyAkc21hbGwtc2NyZWVuOiA0ODBweFxuXHRcdC8vICRtZWRpdW0tc2NyZWVuOiA3NjlweFxuXHRcdC8vICRtLWxhcmdlLXNjcmVlbjogOTYwcHhcblx0XHQvLyAkbGFyZ2Utc2NyZWVuOiAxMjAwcHhcblx0XHQvLyAkeC1sYXJnZS1zY3JlZW46IDE2MDBweFxuXG5cdFx0JCh3aW5kb3cpLmJyZWFrcG9pbnRzKHtcblx0XHRcdGJyZWFrcG9pbnRzOiBbe1xuXHRcdFx0XHRcIm5hbWVcIjogXCJzbVwiLFxuXHRcdFx0XHRcIndpZHRoXCI6IDQ4MFxuXHRcdFx0fSwge1xuXHRcdFx0XHRcIm5hbWVcIjogXCJtZFwiLFxuXHRcdFx0XHRcIndpZHRoXCI6IDc2OVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcIm5hbWVcIjogXCJtZC1sZ1wiLFxuXHRcdFx0XHRcIndpZHRoXCI6IDk2MFxuXHRcdFx0fSwge1xuXHRcdFx0XHRcIm5hbWVcIjogXCJsZ1wiLFxuXHRcdFx0XHRcIndpZHRoXCI6IDEyMDBcblx0XHRcdH0sIHtcblx0XHRcdFx0XCJuYW1lXCI6IFwieC1sZ1wiLFxuXHRcdFx0XHRcIndpZHRoXCI6IDE2MDBcblx0XHRcdH1dXG5cdFx0fSk7XG5cblx0XHQkKHdpbmRvdykuYnJlYWtwb2ludHMoXCJsZXNzVGhhblwiLCBcImxnXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gaWYgbGVzcyB0aGFuIGxhcmdlIHdpZHRoLCBjb2xsYXBzZSBieSBkZWZhdWx0XG5cdFx0XHQkKCcuY29sbGFwc2libGUnKS5yZW1vdmVDbGFzcygnb3BlbicpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykubmV4dCgpLmhpZGUoXCJmYXN0XCIpO1x0XHRcdFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0JCh3aW5kb3cpLmJyZWFrcG9pbnRzKFwiZ3JlYXRlckVxdWFsVG9cIiwgXCJsZ1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGlmIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBsYXJnZSB3aXRoLCBvcGVuIGJ5IGRlZmF1bHRcblx0XHRcdCQoJy5jb2xsYXBzaWJsZScpLmFkZENsYXNzKCdvcGVuJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS5uZXh0KCkuc2hvdyhcImZhc3RcIik7XHRcdFx0XG5cdFx0XHR9KTtcblxuXHRcdH0pO1xuXHRcdC8vIENvbnN0YW50IENoZWNrIEV4YW1wbGVcblx0XHQkKHdpbmRvdykuYmluZChcImJyZWFrcG9pbnQtY2hhbmdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHQkKHdpbmRvdykuYnJlYWtwb2ludHMoXCJsZXNzVGhhblwiLCBcImxnXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBpZiBsZXNzIHRoYW4gbGFyZ2Ugd2lkdGgsIGNvbGxhcHNlIGJ5IGRlZmF1bHRcblx0XHRcdFx0JCgnLmNvbGxhcHNpYmxlJykucmVtb3ZlQ2xhc3MoJ29wZW4nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykubmV4dCgpLmhpZGUoXCJmYXN0XCIpO1x0XHRcdFxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0JCh3aW5kb3cpLmJyZWFrcG9pbnRzKFwiZ3JlYXRlckVxdWFsVG9cIiwgXCJsZ1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaWYgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIGxhcmdlIHdpdGgsIG9wZW4gYnkgZGVmYXVsdFxuXHRcdFx0XHQkKCcuY29sbGFwc2libGUnKS5hZGRDbGFzcygnb3BlbicpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5uZXh0KCkuc2hvdyhcImZhc3RcIik7XHRcdFx0XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBzdGlja3kgc3VibmF2XG5cdFx0dmFyICBzbiA9ICQoXCIjc3ViTmF2XCIpO1xuXHRcdCAgICBzbnMgPSBcInNjcm9sbGVkXCI7XG5cdFx0ICAgIGhkciA9ICQoJ2hlYWRlcicpLmhlaWdodCgpO1xuXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0XHQgIGlmKCAkKHRoaXMpLnNjcm9sbFRvcCgpID4gaGRyICsgNzApIHtcblx0XHQgICAgc24uYWRkQ2xhc3Moc25zKTtcblx0XHQgIH0gZWxzZSB7XG5cdFx0ICAgIHNuLnJlbW92ZUNsYXNzKHNucyk7XG5cdFx0ICB9XG5cdFx0fSk7XG5cblx0Ly8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cblx0XHQvLyBhZGQgbW9iaWxlIGNsYXNzIHRvIGJvZHkgaWYgaXNNb2JpbGVcblx0XHRpZihpc01vYmlsZS5hbnkoKSkge1xuXHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJtb2JpbGVcIik7XG5cdFx0fVxuXG5cdFx0Ly8gRmluZCBhbGwgaWZyYW1lc1xuXHRcdHZhciAkaWZyYW1lcyA9ICQoXCJpZnJhbWVcIik7XG5cdFx0IFxuXHRcdC8vIEZpbmQgJiBzYXZlIHRoZSBhc3BlY3QgcmF0aW8gZm9yIGFsbCBpZnJhbWVzXG5cdFx0JGlmcmFtZXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkKHRoaXMpLmRhdGEoXCJyYXRpb1wiLCB0aGlzLmhlaWdodCAvIHRoaXMud2lkdGgpXG5cdFx0XHRcdC8vIFJlbW92ZSB0aGUgaGFyZGNvZGVkIHdpZHRoICYjeDI2OyBoZWlnaHQgYXR0cmlidXRlc1xuXHRcdFx0XHQucmVtb3ZlQXR0cihcIndpZHRoXCIpXG5cdFx0XHRcdC5yZW1vdmVBdHRyKFwiaGVpZ2h0XCIpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gbWFrZSBjZXJ0YWluIHRoaW5ncyBoYXBwZW4gb24gbG9hZCBhbmQgb24gcmVzaXplXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHQkaWZyYW1lcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gR2V0IHRoZSBwYXJlbnQgY29udGFpbmVyJyYjeDI3OydzIHdpZHRoXG5cdFx0XHRcdHZhciB3aWR0aCA9ICQodGhpcykucGFyZW50KCkud2lkdGgoKTtcblx0XHRcdFx0JCh0aGlzKS53aWR0aCh3aWR0aClcblx0XHRcdFx0XHQuaGVpZ2h0KHdpZHRoICogJCh0aGlzKS5kYXRhKFwicmF0aW9cIikpO1xuXHRcdFx0fSk7XG5cdFx0fSkucmVzaXplKCk7IC8vIEludm9rZSB0aGUgcmVzaXplIGV2ZW50IGltbWVkaWF0ZWx5XG5cblxuXHRcdC8vIG1haW5OYXYgYWN0aXZlIHRvZ2dsZVxuXHRcdCQoJyNtZW51VHJpZ2dlciBhJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG5cdFx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblxuXHRcdC8vIHNtb290aCBhbmNob3Igc2Nyb2xsaW5nOiBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2pxdWVyeS9zbW9vdGgtc2Nyb2xsaW5nL1xuXHRcdCQoJ2FbaHJlZio9XCIjXCJdOm5vdChbaHJlZj1cIiNcIl0pJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAobG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpID09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sJycpICYmIGxvY2F0aW9uLmhvc3RuYW1lID09IHRoaXMuaG9zdG5hbWUpIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9ICQodGhpcy5oYXNoKTtcblx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0Lmxlbmd0aCA/IHRhcmdldCA6ICQoJ1tuYW1lPScgKyB0aGlzLmhhc2guc2xpY2UoMSkgKyddJyk7XG5cdFx0XHRcdGlmICh0YXJnZXQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0XHRcdCAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wXG5cdFx0XHRcdFx0fSwgMjAwKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0Ly8gUmVwbGFjZSBhbGwgU1ZHIGltYWdlcyB3aXRoIGlubGluZSBTVkdcblx0XHRqUXVlcnkoJ2ltZy5zdmcnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0ICAgIHZhciAkaW1nID0galF1ZXJ5KHRoaXMpO1xuXHRcdCAgICB2YXIgaW1nSUQgPSAkaW1nLmF0dHIoJ2lkJyk7XG5cdFx0ICAgIHZhciBpbWdDbGFzcyA9ICRpbWcuYXR0cignY2xhc3MnKTtcblx0XHQgICAgdmFyIGltZ1VSTCA9ICRpbWcuYXR0cignc3JjJyk7XG5cblx0XHQgICAgalF1ZXJ5LmdldChpbWdVUkwsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHQgICAgICAgIC8vIEdldCB0aGUgU1ZHIHRhZywgaWdub3JlIHRoZSByZXN0XG5cdFx0ICAgICAgICB2YXIgJHN2ZyA9IGpRdWVyeShkYXRhKS5maW5kKCdzdmcnKTtcblxuXHRcdCAgICAgICAgLy8gQWRkIHJlcGxhY2VkIGltYWdlJ3MgSUQgdG8gdGhlIG5ldyBTVkdcblx0XHQgICAgICAgIGlmKHR5cGVvZiBpbWdJRCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgICAgICAgICAkc3ZnID0gJHN2Zy5hdHRyKCdpZCcsIGltZ0lEKTtcblx0XHQgICAgICAgIH1cblx0XHQgICAgICAgIC8vIEFkZCByZXBsYWNlZCBpbWFnZSdzIGNsYXNzZXMgdG8gdGhlIG5ldyBTVkdcblx0XHQgICAgICAgIGlmKHR5cGVvZiBpbWdDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgICAgICAgICAkc3ZnID0gJHN2Zy5hdHRyKCdjbGFzcycsIGltZ0NsYXNzKycgcmVwbGFjZWQtc3ZnJyk7XG5cdFx0ICAgICAgICB9XG5cblx0XHQgICAgICAgIC8vIFJlbW92ZSBhbnkgaW52YWxpZCBYTUwgdGFncyBhcyBwZXIgaHR0cDovL3ZhbGlkYXRvci53My5vcmdcblx0XHQgICAgICAgICRzdmcgPSAkc3ZnLnJlbW92ZUF0dHIoJ3htbG5zOmEnKTtcblxuXHRcdCAgICAgICAgLy8gUmVwbGFjZSBpbWFnZSB3aXRoIG5ldyBTVkdcblx0XHQgICAgICAgICRpbWcucmVwbGFjZVdpdGgoJHN2Zyk7XG5cblx0XHQgICAgfSwgJ3htbCcpO1xuXG5cdFx0fSk7XG5cblx0XHQvLyBmYWRlIG91dCBwYWdlIGxvYWRpbmcgb3ZlcmxheSBvbmNlIGRvY3VtZW50IGlzIHJlYWR5XG5cdFx0Ly8gJChcIiNsb2FkZXJcIikuZmFkZU91dChcInNsb3dcIik7XG5cblx0XHQvLyBkaXNhYmxlIGdvb2dsZSBtYXAgem9vbWluZyB1bnRpbCBjbGlja2VkXG5cdFx0Ly8gJCgnLm1hcC1jb250YWluZXInKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdC8vIFx0JCh0aGlzKS5maW5kKCdpZnJhbWUnKS5hZGRDbGFzcygnY2xpY2tlZCcpXG5cdFx0Ly8gfSkubW91c2VsZWF2ZShmdW5jdGlvbigpe1xuXHRcdC8vIFx0JCh0aGlzKS5maW5kKCdpZnJhbWUnKS5yZW1vdmVDbGFzcygnY2xpY2tlZCcpXG5cdFx0Ly8gfSk7XG5cblx0XHQvLyBzdGVsbGFyIHBhcmFsbGF4IHNjcm9sbGluZyBkaXNhYmxlZCBvbiBtb2JpbGVcblx0XHQvLyBpZiggIWlzTW9iaWxlLmFueSgpICl7XG5cdFx0Ly8gXHQkLnN0ZWxsYXIoe1xuXHRcdC8vIFx0XHRob3Jpem9udGFsU2Nyb2xsaW5nOiBmYWxzZSxcblx0XHQvLyBcdFx0dmVydGljYWxPZmZzZXQ6IDQwXG5cdFx0Ly8gXHR9KTtcblx0XHQvLyB9XG5cblx0XHQvLyBSRVRJTkEgaW1hZ2VzIC8gYmFja2dyb3VuZC1pbWFnZXNcblx0XHQvLyBpZih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+PSAxLjIpe1xuXHRcdC8vIFx0JChcIltkYXRhLTJ4XVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0Ly8gXHRcdGlmKHRoaXMudGFnTmFtZSA9PSBcImltZ1wiKXtcblx0XHQvLyBcdFx0XHQkKHRoaXMpLmF0dHIoXCJzcmNcIiwkKHRoaXMpLmF0dHIoXCJkYXRhLTJ4XCIpKTtcblx0XHQvLyBcdFx0fSBlbHNlIHtcblx0XHQvLyBcdFx0XHQkKHRoaXMpLmNzcyh7XCJiYWNrZ3JvdW5kLWltYWdlXCI6XCJ1cmwoXCIrJCh0aGlzKS5hdHRyKFwiZGF0YS0yeFwiKStcIilcIn0pO1xuXHRcdC8vIFx0XHR9XG5cdFx0Ly8gXHR9KTtcblx0XHQvLyB9XG5cblx0XHQvLyBlcXVhbCBoZWlnaHQgY29sdW1uczogaHR0cDovL2JybS5pby9qcXVlcnktbWF0Y2gtaGVpZ2h0L1xuXHRcdC8vICQoJy5tYXRjaC1oZWlnaHQgPiBkaXYnKS5tYXRjaEhlaWdodCgpO1xuXG5cblx0fSk7XG59KShqUXVlcnkpO1xuXG4iXX0=
