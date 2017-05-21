/**
 * Created by Jean-Baptiste on 06/05/2017.
 */


var
    paused_bool = false,
    Config = require('../gameobjects/config'),

    PauseManager = require('../../game/utils/pausemanager'),
    SvgUtils = require('../../game/utils/svgutils'),
    pauseButton = Config('interface').dom_el.getElementsByClassName('pauseButton')[0],
    togglePause = function () {
            paused_bool = !paused_bool;
            PauseManager.playing = !paused_bool;
            pauseButton.setAttribute('aria-selected', paused_bool);
    };



pauseButton.addEventListener('mousedown', togglePause);
SvgUtils.simulateEnterClick(pauseButton, togglePause);



module.exports = {};
