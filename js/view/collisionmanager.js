/**
 * Created by Jean-Baptiste on 05/03/2017.
 */
"use Strict";

var
    Config = require('./config'),
    ItemList = require('./itemlist'),
    isItem = function (itemType_str, point) {
        var result_obj,
        items_array = ItemList[itemType_str];
        if (!point) {
            return false;
        }
        result_obj = items_array.filter(function (item_obj) {
            if (item_obj.targetPosition) {
                return point.x === item_obj.targetPosition.x && point.y === item_obj.targetPosition.y;
            } else {
                return point.x === item_obj.position.x && point.y === item_obj.position.y;
            }
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