/**
 * Created by Jean-Baptiste on 06/05/2017.
 * @module
 * @description This componenent manages the state and display of the pause button. It is managed by PauseManager.
 */

var
    paused_bool = false,
    Config = require('../gameobjects/config'),
    PauseManager = require('../../game/utils/pausemanager'),
    SvgUtils = require('../../game/utils/svgutils'),
    pauseButton = Config('interface').dom_el.querySelector('.pauseButton'),
    togglePause = function (evt) {
            paused_bool = !paused_bool;
            PauseManager.pauseButton = paused_bool;
            pauseButton.setAttribute('aria-selected', paused_bool);
            evt.stopPropagation();
    };
pauseButton.addEventListener('mousedown', togglePause);
pauseButton.addEventListener('touchstart', togglePause);
SvgUtils.simulateEnterClick(pauseButton, togglePause);
module.exports = {};
