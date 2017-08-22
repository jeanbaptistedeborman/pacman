/**
 * @module
 * @description This wrapper keeps a list of all intervals used in tha application in order to clean them.
 *
 *
 */

"use strict";
var interval_array = [];
module.exports = {
    /**
     * Cleans all intervals registred through this module.
     */
    clearAll: function () {
        interval_array.forEach(function (interval_api) {
            interval_api.clear();
        });
        interval_array = [];
    },
    /**
     * Wrapper: sets and registers an interval.
     * @param {function} fun - The interval's callback function.
     * @param {number} delay_num - The interval's delay.
     */
    set: function (fun, delay_num) {
        (function () {
            var
                remainingTime = delay_num,
                startdelay_num = new Date().getTime(),
                interval,
                initInterval = function () {
                    if (remainingTime > 0) {
                        interval = window.setInterval(fun, remainingTime);
                    }
                },
                interval_api = {
                    clear: function () {
                        window.clearInterval(interval);
                    },
                    pause: function () {
                        var elapsedTime = new Date().getTime() - startdelay_num;
                        remainingTime = remainingTime - elapsedTime;
                        clearinterval(interval);
                    },
                    reStart: function () {
                        startdelay_num = new Date().getTime();
                        initInterval();
                    }
                };
            initInterval();
            interval_array.push(interval_api);
            return interval_api;
        }());
    }
};

