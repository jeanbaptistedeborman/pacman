/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    Config = require('./config'),
    UserControls = require('../game/ui/usercontrol'),
    IntervalManager = require('../game/utils/intervalmanager'),
    gridSize_num = Config('stage').gridSize;

var utils = {
    isAllowed: function (point) {
        console.log (point);
        var
            isInStage = function (point) {
                var stage_rect = Config('stage').position,
                    isAboveMin_bool = point.x >= 0 && point.y >= 0,
                    isBelowMin_bool = point.x <= stage_rect.width && point.y <= stage_rect.height;
                return isAboveMin_bool && isBelowMin_bool;
            };
        return isInStage(point);
    }
};


module.exports = function (configId_str, userControl_bool) {
    var
        description_obj = Config(configId_str),
        position_rect = description_obj.position,
        updatePos = function (point) {
            for (var n in point) {
                var value_num = point[n];
                position_rect[n] = point[n];
            }
            description_obj.dom_el.setAttribute("x", position_rect.x);
            description_obj.dom_el.setAttribute("y", position_rect.y);
        },
        incrementPos = function (direction_obj) {
            var
                SPEED_NUM = gridSize_num,
                setAxisPosition = function (propName_str) {
                    if (isNaN (direction_obj[propName_str])) {
                        direction_obj[propName_str] = 0;
                    }
                    return position_rect[propName_str] + (direction_obj[propName_str] * SPEED_NUM)
                },
                newPos_point =
                {
                    x: setAxisPosition ('x'),
                    y: setAxisPosition ('y')
                };

            if (utils.isAllowed (newPos_point)) {
                updatePos(newPos_point);
            } else {
                console.log ('not allowed');
            }
        },
        move = function () {
            IntervalManager.set(function () {
                updatePos({x: Number(position_rect.x) + 5});
            }, 20);
        };
    if (userControl_bool) {
        IntervalManager.set(function () {
            var
                direction_obj = UserControls.getDirection(position_rect);
            if (direction_obj) {
                incrementPos(direction_obj);
            }
        }, 50);
    }
    return {
        set pos(point) {
            updatePos(point);
        },
        set moveDirection(point) {
            moveTo(point);
        }
    };
};
