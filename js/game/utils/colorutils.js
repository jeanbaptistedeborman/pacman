/**
 * Created by Jean-Baptiste on 29/04/2017.
 */


module.exports = {
    multiply: function (hex, percent_dec) {
        var
            hexToRgb = function (hex) {
                var res = hex.match(/[a-f0-9]{2}/gi);
                return res && res.length === 3
                    ? res.map(function (v) {
                        return parseInt(v, 16)
                    })
                    : null;
            },
            rgbToRGBA = function (rgb_array) {
                return ('rgb(' + rgb_array.join(',') + ')');
            },
            rgb_array = hexToRgb(hex),
            result_array = [];
        rgb_array.forEach(function (element, index) {
            result_array.push(Math.round(Number(element) * percent_dec));
        });
        return rgbToRGBA(result_array);
    }
};