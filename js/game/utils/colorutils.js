/**
 * Created by Jean-Baptiste on 29/04/2017.
 * @module
 * @description Utility function to handle colors
 */


module.exports = {
    /**
     * Applies a "multiply" - filter
     * @param {number} hex - The input color in hexadecimal format
     * @param {number} percent_dec - The multiply modifier in decimal form (<1 = darker, >1 = brighter)
     */
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
        rgb_array.forEach(function (element) {
            result_array.push(Math.round(Number(element) * percent_dec));
        });
        return rgbToRGBA(result_array);
    }
};