/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
module.exports = function (from_point, to_point) {
    var diffs_obj = {
        x: to_point.x - from_point.x,
        y: to_point.y - from_point.y
    };
    if (Math.abs(diffs_obj.x) > Math.abs(diffs_obj.y)) {
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