/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
module.exports = function (from_point, to_point, longestPath_bool) {
    var diffs_obj = {
        x: to_point.x - from_point.x,
        y: to_point.y - from_point.y
    };
    var xIsShorter_bool = Math.abs(diffs_obj.x) > Math.abs(diffs_obj.y);
    if (longestPath_bool) {
        xIsShorter_bool = !xIsShorter_bool;
    }

    if (xIsShorter_bool) {
        return {
            x: diffs_obj.x / Math.abs(diffs_obj.x),
            y: 0
        }
    } else {
        return {
            y: diffs_obj.y / Math.abs(diffs_obj.y),
            x: 0
        }
    }
};