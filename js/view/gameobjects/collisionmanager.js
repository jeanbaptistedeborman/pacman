/**
 * Created by Jean-Baptiste on 05/03/2017.
 */

"use Strict";

/**
 * @module
 * @description Tests whether a given point on the grid is already occupied by anotehr object.
 */

var
    Config = require('./config'),
    ObjectListManager = require('./objectlistmanager'),
    /**
     * @private
     * @param {string} itemType_str - The type of object to test.
     * @param {Point} point The x and y coordinates
     * @returns {booleans|*} false OR The object at a given point (if exists)
     */
    isItem = function (itemType_str, point) {
        var
            result_obj,
            items_array = ObjectListManager.getList(itemType_str);

        if (!point) {
            return false;
        }
        result_obj = items_array.filter(function (item_obj) {
            var testPoint = function (ref_point) {
                    return point.x >= ref_point.x &&
                        point.x < ref_point.x + item_obj.position.width &&
                        point.y >= ref_point.y && point.y < ref_point.y + item_obj.position.height;

                },
                result1 = testPoint(item_obj.position);
            if (result1) {
                return result1;
            } else if (item_obj.targetPosition) {
                return testPoint(item_obj.targetPosition);
            }
        })[0];
        return result_obj;
    };
module.exports = {
    /**
     * Test wether there is a goodie at the given coordinate

     * @param {Point} point The x and y coordinates
     * @returns {booleans|Object} false OR The goodie at the given point (if exists)
     */

    isGoodie: function (point) {
        return isItem("goodie", point);
    },

    /**
     * Test wether the player avatar is at the given coordinates
     * @param {Point} point The x and y coordinates
     * @returns {booleans|Object} false OR The player avatar at the given point (if exists)
     */
    isAvatar: function (point) {
        return isItem("playerAvatar", point);
    },
    /**
     * Test wether any object occupies the coordinates And if the coordinates are out of the stage.
     * @param {Point} point The x and y coordinates
     * @returns {boolean|string|Object} false OR "out of screen" OR  the object already occupying the given point (if exists)
     */

    isOccupied: function (point) {
        if (point) {
            var
                isInStage = function (point) {
                    var stage_rect = Config('stage').position,
                        isAboveMin_bool = point.x >= 0 && point.y >= 0,
                        isBelowMin_bool = point.x < stage_rect.width && point.y < stage_rect.height;
                    return isAboveMin_bool && isBelowMin_bool;
                },
                stageTest_bool = isInStage(point),
                obstacleTest_obj = isItem("obstacle", point),
                badGuyTest_obj = isItem("badGuy", point);
            if (!stageTest_bool) {
                return 'out of screen'
            }
            if (obstacleTest_obj) {
                return obstacleTest_obj;
            }
            if (badGuyTest_obj) {
                return badGuyTest_obj;
            }
        }
        return null;
    }
};