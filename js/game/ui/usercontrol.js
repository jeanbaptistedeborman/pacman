/**
 * Created by Jean-Baptiste on 2/22/2017.
 */
"use strict";
/**
 * An object containing a direection on x and y axis.
 * @typeDef {Object} Direction
 * @property {number} x  n integer ranging from -1 to 1 expressing the direction on the x-axis (-1 = left, 1= right, 0=no move)
 * @property {number} y An integer ranging from -1 to 1 expressing the direction on the y-axis (-1 = up, 1= down, 0=no move)
 */


var MouseControl = require("./mouseandtouch"),
    KeyControls = require("./keyboard"),
    SvgUtils = require("../utils/svgutils"),
    directionFromTo = require ('../directionfromto'),
    Config = require("../../view/gameobjects/config"),
    stage_el = Config("stage").dom_el;

module.exports = {
    /**
     * @module
     * @description - Aggregates inputs from keyboard, mouse and touch in order to give a consistent representation of user inputs.
     * @param {Point} objectPosition_point - The position of the moving object in order to compare the mouse position with the objects position.
     * @returns {Direction} - An object containing the direction to follow.
     *
     */
    getDirection: function (objectPosition_point) {
        var direction_obj = null;
        if (KeyControls.pressedKey) {
            direction_obj = {};
            switch (KeyControls.pressedKey) {
                case "ArrowRight":
                    direction_obj.x = 1;
                    break;
                case "ArrowLeft":
                    direction_obj.x = -1;
                    break;
                case "ArrowUp":
                    direction_obj.y = -1;
                    break;
                case "ArrowDown":
                    direction_obj.y = 1;
                    break;
            }
            return direction_obj;
        }
        if (objectPosition_point && stage_el && MouseControl.position) {
            var
                mouseSVG_point = SvgUtils.coordinateTransform(stage_el, MouseControl.position);
             return directionFromTo (objectPosition_point, mouseSVG_point);
        }

    }

}
;

