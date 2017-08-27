/**
 * Created by Jean-Baptiste on 16/07/2017.
 */


/**
 * @module
 * @description Basic animations and transitions
 *
 */

module.exports =  {
    /**
     * @description Fades an element form 0 to 100 opacity
     * @param {DomElement} dom_el - The element to animate
     */
    fadeIn:function (dom_el){
        var opacity_num = 0.1,
            interval  = window.setInterval (function () {
              opacity_num *= 1.5;
              if (opacity_num >= 100) {
                  opacity_num = 100;
                  window.clearInterval (interval);
              }
                dom_el.setAttribute ('opacity', opacity_num);

        }, 50);
        dom_el.setAttribute ('opacity', opacity_num);
    }
};
