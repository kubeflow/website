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