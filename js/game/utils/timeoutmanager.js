"use strict";
var timout_array = [];
module.exports = {
    clearAll: function () {
        timout_array.forEach(function (timeout_api) {
            timeout_api.clear();
        });
        timout_array = [];
    },
    set: function (fun, delay_num) {
        (function () {
            var
                remainingTime = delay_num,
                startdelay_num = new Date().getTime(),
                interval,
                initTimeout = function () {
                    if (remainingTime > 0) {
                        interval = window.setTimeout(fun, remainingTime);
                    }
                },
                timeout_api = {
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
                        initTimeout();
                    }
                };
            initTimeout();
            timout_array.push(timeout_api);
            return timeout_api;
        }());
    }
};

