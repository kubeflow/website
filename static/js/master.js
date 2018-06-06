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

            p = this;
            p.styleToc();
            $(window).resize(function() {
                p.styleToc();
             });
        },
        styleToc: function() {
          if (this.detect.isDesktopScreen()) {
            this.$element.css({ position: "fixed",
                                right: "1em",
                                overflowY: "auto",
                                maxHeight: "800px"});
          } else {
              this.$element.css({ position: "static",
                                  maxHeight: "none"});
          }
        }
    };

    // Inheritance
    Kube.TocLocator.inherits(Kube);

    // Plugin
    Kube.Plugin.create("TocLocator");
    Kube.Plugin.autoload("TocLocator");

}(Kube));
