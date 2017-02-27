/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    Config = require('./config'),
    UserControls = require('../game/ui/usercontrol'),
    IntervalManager = require('../game/utils/intervalmanager'),
    Obstacles = require('./obstacle'),
    directionFromTo = require ('../game/directionfromto'),
    gridSize_num = Config('stage').gridSize,
    playerAvatar_api;

var utils = {
    isAllowed: function (point) {
        var
            isInStage = function (point) {
                var stage_rect = Config('stage').position,
                    isAboveMin_bool = point.x >= 0 && point.y >= 0,
                    isBelowMin_bool = point.x < stage_rect.width && point.y < stage_rect.height;
                return isAboveMin_bool && isBelowMin_bool;
            },
            isNotObstacle = function (point) {
                var
                    obstacles_array = Obstacles.obstacles;
                return obstacles_array.filter(function (obstacle_obj) {
                        return point.x === obstacle_obj.position.x && point.y === obstacle_obj.position.y;
                    }).length < 1;
            },
            isNotBadGuy = function (point) {

            } ;
        return isInStage(point) && isNotObstacle(point);
    }
};

module.exports = {
    add:function (config, userControl_bool) {
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

                if (utils.isAllowed(newPos_point)) {
                    updatePos(newPos_point);
                } else {
                    console.log('not allowed');
                }
            },
            moveToAvatar = function () {
                IntervalManager.set(function () {
                    var
                        direction_obj = directionFromTo (position_rect, playerAvatar_api.pos);
                    if (direction_obj) {
                        incrementPos(direction_obj);
                    }
                }, 100);
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
            moveToAvatar ();
        }
        var api =  {
            get pos () {
              return config.position;
            },
            set pos(point) {
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

