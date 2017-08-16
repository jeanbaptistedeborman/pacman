/**
 * Created by Jean-Baptiste on 06/05/2017.
 * @module
 * @description Manages the pauses in the game (caused by popup displays, pause-button, ...)
 *
 */

"use strict";
var
    app_el = require ('../../view/gameobjects/config')('app').dom_el,
    noPopup_bool = true,
    evaluatePause =  function (){
        var paused_bool =  noPopup_bool && pauseButton_bool;
        if (pauseButton_bool) {
            app_el.classList.remove ('pauseButtonTriggered');
        } else {
            app_el.classList.add ('pauseButtonTriggered');
        }
        return paused_bool;
    },
    pauseButton_bool = true;
module.exports = {
    /**
     *
     * @description Gets or sets wether the pause-pause-button is on or off.
     * @type {Boolean}
     */
    set pauseButton (boolean) {
        pauseButton_bool = !boolean;
        evaluatePause();
    },
    get pauseButton ()  {
        return pauseButton_bool;
    },
    /**
     * @type {Boolean}
     * @description Gets or sets wether the game is playing or not.
     */

    set playing   (boolean) {
        if (boolean === undefined) {
            noPopup_bool = !noPopup_bool;
        } else {
            noPopup_bool = boolean;
        }
        evaluatePause();
    },
    get playing () {
        return evaluatePause ();
    }

};
