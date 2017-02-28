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
    isAvatar : function (point) {
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
                        return point.x === item_obj.position.x && point.y === item_obj.position.y;
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
            incrementPos = function (direction_obj) {
                var
                    SPEED_NUM = gridSize_num,
                    setAxisPosition = function (propName_str) {
                        if (isNaN(direction_obj[propName_str])) {
                            direction_obj[propName_str] = 0;
                        }
                        return position_rect[propName_str] + (direction_obj[propName_str] * SPEED_NUM)
                    },
                    newPos_point =
                    {
                        x: setAxisPosition('x'),
                        y: setAxisPosition('y')
                    };
                if (config.type === 'badGuy' && utils.isAvatar(newPos_point)) {
                    console.log ("You lost");

                }
                if (utils.isAllowed(newPos_point)) {
                    updatePos(newPos_point);
                } else {
                }
            },
            moveToAvatar = function () {
                IntervalManager.set(function () {
                    var
                        direction_obj = directionFromTo(position_rect, playerAvatar_api.position);
                    if (direction_obj) {
                        incrementPos(direction_obj);
                    }
                }, 150);
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
        if (config.type === 'badGuy') {
            moveToAvatar();
        }
        var api = {
            get position() {
                return config.position;
            },
            set position(point) {
                updatePos(point);
            },
            set moveDirection(point) {
                moveTo(point);
            }
        };
        if (config.type === 'playerAvatar') {
            playerAvatar_api = api;
        }
        return api;
    }
};

