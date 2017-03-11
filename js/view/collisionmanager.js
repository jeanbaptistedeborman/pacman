/**
 * Created by Jean-Baptiste on 05/03/2017.
 */
"use Strict";

var
    Config = require('./config'),
    ItemList = require('./itemlist'),
    isItem = function (){

    };
module.exports = {
    isGoodie: function (point) {

    },
    isAvatar: function (point)  {
        var playerAvatar_api = ItemList["playerAvatar"][0];
        return playerAvatar_api.position.x === point.x && playerAvatar_api.position.y === point.y;
    },
    isAllowed: function (point) {
        var
            isInStage = function (point) {
                var stage_rect = Config('stage').position,
                    isAboveMin_bool = point.x >= 0 && point.y >= 0,
                    isBelowMin_bool = point.x < stage_rect.width && point.y < stage_rect.height;
                return isAboveMin_bool && isBelowMin_bool;
            },
            isNotItem = function (itemType_str, point) {
                var
                    items_array = ItemList[itemType_str];
                return items_array.filter(function (item_obj) {
                        if (item_obj.targetPosition) {

                            return point.x === item_obj.targetPosition.x && point.y === item_obj.targetPosition.y;
                        } else {
                            return point.x === item_obj.position.x && point.y === item_obj.position.y;

                        }

                    }).length < 1;
            };
        return isInStage(point) && isNotItem("obstacle", point) && isNotItem("badGuy", point);
    }
};