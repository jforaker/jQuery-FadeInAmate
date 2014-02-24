// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var fadeInAmate = "fadeInAmate",
        defaults = {
            initialDelay: 10,
            fadeInSpeed: 500,
            animationDelay: 500,
            bounce: true
        };

    // The actual plugin constructor
    function FadeInAmate ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = fadeInAmate;
        this.init();
    }

    FadeInAmate.prototype = {
        init: function () {
            // call them like so: this.yourOtherFunction(this.element, this.settings).

            var $faders = document.getElementsByClassName(this.element.className),
                fadersLength = $faders.length;

            this.showUs($faders, this.settings, fadersLength);
        },

        showUs: function (items, settings, number) {
            var that = this;

            $(items).hide();

            var opts = {
                initialDelay: settings.initialDelay,
                fadeInSpeed : settings.fadeInSpeed,
                animationDelay: settings.animationDelay,
                bounceTrue :  settings.bounce === true,
                bounceFalse: settings.bounce !== true
            };

            var num = number;

            var runShowBounce = opts.bounceTrue;

            $.each(items, function(index, element){

                var $el = $(element);
                var delayTime = index === 0 ? opts.initialDelay: opts.initialDelay + (opts.animationDelay * index); //animationDelay

                $el.css({
                    position: 'relative',
                    top: '-20px',
                    transition: 'top 1s ease'
                })
                    .fadeIn(opts.fadeInSpeed).delay(delayTime);

                console.log(delayTime)

            });

            if (runShowBounce) that.bouncer(items, opts);
        },

        bouncer: function(els, options){

            var interval = options.fadeInSpeed + options.initialDelay,
                index = 0,
                length = $(els).length;

            function getNext(){
                setTimeout(function() {
                    $(els[index]).css({top: 0});
                    index++;

                    console.log(index);

                    if (index === length){
                        index = 0;
                    } else {
                        getNext();
                    }

                }, (interval / length) * index);
            }

            getNext();
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ fadeInAmate ] = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + fadeInAmate ) ) {
                $.data( this, "plugin_" + fadeInAmate, new FadeInAmate( this, options ) );
            }
        });

        // chain jQuery functions
        return this;
    };

})( jQuery, window, document );
