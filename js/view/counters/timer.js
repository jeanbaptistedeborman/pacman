/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    IntervalManager = require('../../game/utils/intervalmanager'),
    PauseManager = require('../../game/utils/pausemanager'),
    SvgUtils = require('../../game/utils/svgutils'),
    startTime_num,
    time_num = 0,
    clockBackground_el = document.getElementById('clockBackground'),
    text_el = document.getElementById('time'),
    interval,
    clockPos = {
        x: 24.112,
        y: 17.695,
        holeRadius: 0,
        radius: 6.2515
    },
    container_el = document.getElementById('game_js'),
    clock_el = SvgUtils.getSlice(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, 0);

clock_el.setAttribute('fill', '#b0b0b0');
container_el.appendChild(clock_el);

countDown = function () {
    if (PauseManager.playing) {
        display(--time_num);
        if (time_num === 0 && onTimeElapsed_fun) {
            onTimeElapsed_fun();
        }
    }
},
    display = function (remainTime_num) {
        if (remainTime_num) {
            var angle_num = 360 - (360 * (remainTime_num / startTime_num));
            clock_el.setAttribute('d', SvgUtils.getSliceAttribute(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, angle_num));
            text_el.textContent = remainTime_num;
        }
    };
module.exports = {
    start: function (p_startTime_num) {
        if (interval) {
            interval.clear();
        }
        display(startTime_num);
        startTime_num = time_num = p_startTime_num;
        interval = IntervalManager.set(countDown, 1000);
    },
    set onTimeElapsed(fun) {
        onTimeElapsed_fun = fun;
    }
};


