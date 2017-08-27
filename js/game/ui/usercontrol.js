/**
 * Created by Jean-Baptiste on 2/22/2017.
 * @module
 * @description Aggregates inputs from keyboard, mouse and touch in order to give a consistent representation of user inputs.
 *
 */


/**
 * An object describing a point on x and y axis.
 * @typeDef {Object} Point
 * @property {number} x The position on the x-axis
 * @property {number} y The position on the y-axis
 */

/**
 * An object describing a direction on x and y axis.
 * @typeDef {Object} Direction
 * @property {number} x  An integer ranging from -1 to 1 expressing the direction on the x-axis (-1 = left, 1= right, 0=no move)
 * @property {number} y An integer ranging from -1 to 1 expressing the direction on the y-axis (-1 = up, 1= down, 0=no move)
 */


"use strict";


var MouseControl = require("./mouseandtouch"),
    KeyControls = require("./keyboard"),
    SvgUtils = require("../utils/svgutils"),
    directionFromTo = require('../directionfromto'),
    Config = require("../../view/gameobjects/config"),
    stage_el = Config("stage").dom_el,
    previousDirection_obj = {x: 0, y: 0},
    onDirectionChange_fun,
    addChangeInfo = function (newDirection_obj) {
        newDirection_obj.directionChange =
            previousDirection_obj &&
            (newDirection_obj.x !== 0 || newDirection_obj.y !== 0) &&
            (previousDirection_obj.x !== newDirection_obj.x ||
            previousDirection_obj.y !== newDirection_obj.y);
        if (newDirection_obj.directionChange && onDirectionChange_fun) {
            onDirectionChange_fun(newDirection_obj);
        }
        previousDirection_obj = newDirection_obj;
    };

module.exports = {
    /**
     * @property onDirectionChange
     * @description - Sets a callback called when the user changes direction.
     * @type {function}
     */

    set onDirectionChange(fun) {
        onDirectionChange_fun = fun;
    },
    /**
     * @description - Gets the direction indepependently of the device used
     * @param {Point} reference_point -The reference point used to get a direction when comparing with the mouse or touch position.
     * @returns {Direction} -An object containing the direction to follow.
     *
     */
    getDirection: function (reference_point) {
        var
            direction_obj;
        if (KeyControls.pressedKey) {
            direction_obj = {x: 0, y: 0};
            switch (KeyControls.pressedKey) {
                case "Right":
                case "ArrowRight":
                    direction_obj.x = 1;
                    break;
                case "Left":
                case "ArrowLeft":
                    direction_obj.x = -1;
                    break;
                case "Up":
                case "ArrowUp":
                    direction_obj.y = -1;
                    break;
                case "Down":
                case "ArrowDown":
                    direction_obj.y = 1;
                    break;
            }
            addChangeInfo(direction_obj);
            return direction_obj;
        }
        if (reference_point && stage_el && MouseControl.position) {

            var
                mouseSVG_point = SvgUtils.convertCoordinateFromDOMToSVG(stage_el, MouseControl.position),
                gridSize_num = Config('stage').gridSize;
            if (mouseSVG_point.x >= reference_point.x
                && mouseSVG_point.y >= reference_point.y
                && mouseSVG_point.x < reference_point.x + gridSize_num
                && mouseSVG_point.y < reference_point.y + gridSize_num) {
                direction_obj = {x: 0, y: 0};
            } else {
                direction_obj = directionFromTo({
                    x: reference_point.x + gridSize_num / 2,
                    y: reference_point.y + gridSize_num / 2
                }, mouseSVG_point);
            }
            addChangeInfo(direction_obj);
            return direction_obj;
        }

    }
};

