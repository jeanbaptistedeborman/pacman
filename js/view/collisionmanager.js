/**
 * Created by Jean-Baptiste on 05/03/2017.
 */
"use Strict";

var
    Config = require('./config'),
    ItemList = require('./itemlist'),
    isItem = function (itemType_str, point) {
        var
            result_obj,
            items_array = ItemList[itemType_str];

        if (!point) {
            return false;
        }
        console.log (items_array);
        result_obj = items_array.filter(function (item_obj) {
            var ref_point = item_obj.targetPosition || item_obj.position;

            return point.x >= ref_point.x &&
                point.x < ref_point.x + item_obj.position.width
                &&
                point.y >= ref_point.y && point.y < ref_point.y + item_obj.position.height;

        })[0];
        return result_obj;
    };
module.exports = {
    isGoodie: function (point) {
        return isItem("goodie", point);
    },
    isAvatar: function (point) {
        return isItem("playerAvatar", point);
    },
    isAllowed: function (point) {
        var
            isInStage = function (point) {
                var stage_rect = Config('stage').position,
                    isAboveMin_bool = point.x >= 0 && point.y >= 0,
                    isBelowMin_bool = point.x < stage_rect.width && point.y < stage_rect.height;
                return isAboveMin_bool && isBelowMin_bool;
            };
        return isInStage(point) && !isItem("obstacle", point) && !isItem("badGuy", point);
    }
};