/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
"use strict";

var
    IntervalManager = require('../../game/utils/intervalmanager'),
    PauseManager = require('../../game/utils/pausemanager'),
    SvgUtils = require('../../game/utils/svgutils'),
    startTime_num,
    time_num = 0,
    text_el = document.getElementById('time'),
    interval,
    onTimeElapsed_fun,
    clockPos = {
        x: 24.112,
        y: 17.695,
        holeRadius: 0,
        radius: 6.2515
    },
    container_el = document.getElementById('game_js'),
    clock_el = SvgUtils.getSlice(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, 0),
countDown = function () {
    if (PauseManager.pauseButton) {

        if (time_num === 0) {
            display(time_num);
            if (onTimeElapsed_fun) {
                onTimeElapsed_fun();
            }
        } else {
            display(--time_num);
        }
    }
},
    display = function (remainTime_num) {
        var angle_num = 360 - (360 * (remainTime_num / startTime_num));
        if (remainTime_num) {
            clock_el.setAttribute('d', SvgUtils.getSliceAttribute(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, angle_num));
        }
        text_el.textContent = remainTime_num!==undefined?remainTime_num:'';
    };

clock_el.setAttribute('fill', '#b0b0b0');
container_el.appendChild(clock_el);

module.exports = {
    start: function (p_startTime_num) {
        if (interval) {
            interval.clear();
        }
        display(startTime_num);
        startTime_num = time_num = p_startTime_num;
        interval = IntervalManager.set(countDown, 1000);
    },
    get remaining() {
        return time_num;
    },
    set onTimeElapsed(fun) {
        onTimeElapsed_fun = fun;
    }
};


