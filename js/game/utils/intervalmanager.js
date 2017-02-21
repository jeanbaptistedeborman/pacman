"use strict";
var interval_array = [];
module.exports = {
    clearAll: function () {
        interval_array.forEach(function (interval_api) {
            interval_api.clear();
        });
        interval_array = [];
    },
    set: function (fun, delay_num) {
        (function () {
            var
                remainingTime = delay_num,
                startdelay_num = new Date().getTime(),
                interval,
                initinterval = function () {
                    if (remainingTime > 0) {
                        interval = window.setInterval(fun, remainingTime);
                    }
                },
                interval_api = {
                    clear: function () {
                        clearinterval(interval);
                    },
                    pause: function () {
                        var elapsedTime = new Date().getTime() - startdelay_num;
                        remainingTime = remainingTime - elapsedTime;
                        clearinterval(interval);
                    },
                    reStart: function () {
                        startdelay_num = new Date().getTime();
                        initinterval();
                    }
                };
            initinterval();
            interval_array.push(interval_api);
            return interval_api;
        }());
    }
};

