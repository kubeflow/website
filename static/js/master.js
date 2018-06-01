(function(Kube) {
    Kube.TocLocator = function(element, options) {
        this.namespace = "toclocator";

        // Parent Constructor
        Kube.apply(this, arguments);

        // Services
        this.detect = new Kube.Detect();

        // Initialization
        this.start();
    };

    // Functionality
    Kube.TocLocator.prototype = {
        start: function() {
            this.$element = $( "#toc" )

            p = this
            $(document).scroll(function() {
                p.styleToc();
            });
        },
        styleToc: function() {
          if (this.detect.isDesktopScreen()) {
            if ($(document).scrollTop() > 100) {
                this.$element.css({ position: "fixed", right: "1em" });
            } else {
                this.$element.css({ position: "static" });
            }
          }
        }
    };

    // Inheritance
    Kube.TocLocator.inherits(Kube);

    // Plugin
    Kube.Plugin.create("TocLocator");
    Kube.Plugin.autoload("TocLocator");

}(Kube));
