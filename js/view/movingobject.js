/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    Config = require('./config'),
    UserControls = require('../game/ui/usercontrol'),
    IntervalManager = require('../game/utils/intervalmanager'),
    directionFromTo = require('../game/directionfromto'),
    gridSize_num = Config('stage').gridSize,
    ItemList = require('./itemlist'),
    playerAvatar_api;

var utils = {
    isAvatar: function (point) {
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

module.exports = {
    add: function (config, userControl_bool) {
        var
            position_rect = config.position,
            updatePos = function (point) {
                for (var n in point) {
                    position_rect[n] = point[n];
                }
                config.dom_el.setAttribute("x", position_rect.x);
                config.dom_el.setAttribute("y", position_rect.y);
            },
            findPos = function (direction_obj, step_num) {
                var
                    setAxisPosition = function (propName_str) {
                        if (isNaN(direction_obj[propName_str])) {
                            direction_obj[propName_str] = 0;
                        }
                        return position_rect[propName_str] + (direction_obj[propName_str] * step_num);
                    };
                return {
                    x: setAxisPosition('x'),
                    y: setAxisPosition('y')
                };
            },
            incrementPos = function (direction_obj) {
                if (direction_obj) {
                    var newPos_point = findPos(direction_obj, config.speed);
                    updatePos(newPos_point);
                }
            },
            MoveManager = (function () {
                var
                    direction_obj,
                    setDirection = function () {
                        var
                            temptativeDirection_obj = null,
                            temptativePosition_point;
                        if (userControl_bool) {
                            temptativeDirection_obj = UserControls.getDirection(position_rect);
                        }
                        if (config.type === 'badGuy') {
                            temptativeDirection_obj = directionFromTo(position_rect, playerAvatar_api.position);
                        }

                        if (temptativeDirection_obj) {
                            temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                        }
                        if (temptativeDirection_obj && utils.isAllowed(temptativePosition_point)) {
                            direction_obj = temptativeDirection_obj;
                            config.targetPosition = temptativePosition_point;
                        } else {
                            direction_obj = null;
                        }
                    };
                return function () {
                    IntervalManager.set(function () {
                        var changeDirection_bool = config.position.x % gridSize_num === 0 && config.position.y % gridSize_num === 0;
                        if (!direction_obj || changeDirection_bool) {
                            setDirection();
                        }
                        incrementPos(direction_obj);
                    }, 20);
                }
            }()),
            api = {
                get position() {
                    return config.position;
                },
                get targetPosition() {
                        return config.targetPosition;
                },
                set position(point) {
                    updatePos(point);
                },
                set moveDirection(point) {
                    moveTo(point);
                }
            };
        MoveManager();
        if (config.type === 'playerAvatar') {
            playerAvatar_api = api;
        }
        return api;
    }
};

