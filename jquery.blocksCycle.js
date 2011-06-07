/**
 * jquery.blocksCycle.js
 *
 * This plugin is used to randomly change the background of the inner blocks
 * of a container. 
 *
 * @author: Hisakazu Ishibashi
 * @email: h.ishibashi@amediacreative.com
 */
(function($) {

    /**
     * the actual plugin
     */
    $.fn.blocksCycle = function(options) {
        
        // build main options before element iteration
        var opts = $.extend({}, $.fn.blocksCycle.defaults, options);

        // Iterate through the matching elements and start the animation on each of their children
        return this.each(function() {
            $this = $(this);
            
            // build element specific options
            var o = $.meta ? $.extend({}, opts, $this.data('blocksCycle')) : opts;

            // the blocks
            var blocks = $this.children();
            blocks = $.makeArray(blocks);
            
            //Animate doesn't work well inside loops, that's why we have to make a tail recursive call
            cycle(blocks, o.infinite, 0, o.shuffle);
        });
    };

    /**
     * Starts the animation sequence
     */
    function cycle(blocks, infinite, bgIndex, shuffle){
        var curBlocks = blocks.slice();
        var url = $.fn.blocksCycle.defaults.urls[bgIndex];
        var delay = $.fn.blocksCycle.defaults.delay;
        if(shuffle)
            $.fn.blocksCycle.shuffle(curBlocks);
        if(url){
            changeBlocks(curBlocks, url);
            t = setTimeout(function(){cycle(blocks, infinite, ++bgIndex, shuffle)}, delay);
        }else{
            if(infinite)
                cycle(blocks, infinite, 0, shuffle)
                //t = setTimeout(function(){cycle(blocks, infinite, 0)}, delay);
        }
        return;
    }


    /**
     * Used to change to the next image by changing each of the blocks sequentially
     */
    function changeBlocks(blocks, url){
        if(blocks.length>0){
            var block = $(blocks.shift());
            var repeat = block.css('background-repeat');
            var rule = {
                'background': 'url('+url+')',
                'background-repeat': repeat
            };

            //Because of IE need to get background-position and because FF need to make an extra if
            var pos = block.css('background-position');
            if(pos == undefined || pos == null){
                rule['background-position-x'] = block.css('background-position-x');
                rule['background-position-y'] = block.css('background-position-y');
            }else{
                rule['background-position'] = pos;
            }
            
            
            var duration = $.fn.blocksCycle.defaults.duration;
            var opacity = $.fn.blocksCycle.defaults.opacity;
            block.animate({opacity:opacity}, duration, function(){
                changeBlocks(blocks, url);
                block.css(rule).animate({opacity:1}, duration, function(){});
            });
        }
    }

    /**
     * This functions creates the order in which blocks will be changing to the
     * next image.
     */
    $.fn.blocksCycle.shuffle = function(list) {
        var len = list.length;
        var i = len;
        while (i--) {
            var p = parseInt(Math.random()*len);
            var t = list[i];
            list[i] = list[p];
            list[p] = t;
        }
    };
    
    //
    // plugin defaults
    //
    $.fn.blocksCycle.defaults = {
        shuffle: true,          //Indicates if the animation should be random.
        infinite: true,         //Indicates if the cycle should be infinite, it starts looping again from the first background.
        urls: null,             //List of URLs from where to get the images for animation
        first: 0,               //Indicates the first element in the backgrounds list
        /** CAUTION WHEN SETTING THE FOLLOWING VALUES**/
        delay: 10400,            //Indicates the amount of time to wait in order to show the next backgrouind
        duration: 400,          //This value is passed to jquery.anime() called inside. Indicates the duration of a single block change animation.
        opacity: 0            //From 0 to 1 indicates the intensity of a single block change animation.
    };
//
// end of closure
//
})(jQuery);