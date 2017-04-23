/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
module.exports = function (from_point, to_point) {
    var diffs_obj = {
            x: to_point.x - from_point.x,
            y: to_point.y - from_point.y
        },
        MINIMUM_NUM = 10,
        biggestDifProp_str = Math.abs(diffs_obj.x) > Math.abs(diffs_obj.y) ? 'x' : 'y',
        value_num = (Math.abs(diffs_obj[biggestDifProp_str]) > MINIMUM_NUM) ? diffs_obj[biggestDifProp_str] / Math.abs(diffs_obj[biggestDifProp_str]) : 0;
    if (biggestDifProp_str === 'x') {
        return {
            x: value_num,
            y: 0
        }
    } else {
        return {
            y: value_num,
            x: 0
        }
    }
};