/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    Config = require('./config'),
    IntervalManager = require('../../game/utils/intervalmanager'),
    PauseManager = require('../../game/utils/pausemanager'),
    ObjectListManager = require('./objectlistmanager'),
    gridSize_num = Config('stage').gridSize,
    movingObjectsCounter_num = 0;


module.exports = {
    add: function (config) {
        var
            position_rect = config.position,
            updatePos = function (point) {
                for (var n in point) {
                    if (point.hasOwnProperty(n)) {
                        position_rect[n] = point[n];
                    }
                }
                if (config.dom_el) {
                    config.dom_el.setAttribute("x", position_rect.x);
                    config.dom_el.setAttribute("y", position_rect.y);
                }
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
                    var newPos_point = findPos(direction_obj, config.speed * Boolean(PauseManager.playing));
                    updatePos(newPos_point);
                }
            },
            MoveManager = (function () {
                var
                    direction_obj,
                    setDirection = function () {
                        /*
                         @todo:avoid passing findPos as an argument
                         */
                        direction_obj = config.setDirection(findPos);
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
                /*@ todo :  harmonise : every call to config should go through config.*/
                get dom_el() {
                    return config.dom_el;
                },
                get config() {
                    return config;
                },
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
                },
                update: function () {
                    updatePos(config.position);
                }
            };

        if (config.type === "playerAvatar") {
            ObjectListManager.createList('playerAvatar');
            ObjectListManager.pushItem('playerAvatar', api);
        }
        movingObjectsCounter_num++;
        window.setTimeout(MoveManager, movingObjectsCounter_num * 3);
        return api;
    }
};

