/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    Config = require('./config'),
    UserControls = require('../game/ui/usercontrol'),
    IntervalManager = require('../game/utils/intervalmanager'),
    directionFromTo = require('../game/directionfromto'),
    CollisionManager = require('./collisionmanager'),
    gridSize_num = Config('stage').gridSize,
    ItemList = require('./itemlist'),
    movingObjectsCounter_num = 0;

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
                            playerAvatar_api,
                            temptativePosition_point;
                        if (userControl_bool) {
                            temptativeDirection_obj = UserControls.getDirection(position_rect);
                        }
                        if (config.type === 'badGuy') {
                            playerAvatar_api = ItemList['playerAvatar'][0];
                            temptativeDirection_obj = directionFromTo(position_rect, playerAvatar_api.position);
                        }

                        if (temptativeDirection_obj) {
                            temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                        }
                        if (config.type === "badGuy" && CollisionManager.isAvatar(temptativePosition_point)) {
                            IntervalManager.clearAll();
                            alert ('game over : refresh page to test again');
                        }
                        if (config.type === "playerAvatar") {
                            var goodie =  CollisionManager.isGoodie(temptativePosition_point);
                            if (goodie) {
                                var remaining_num = goodie.remove ();
                                if (remaining_num === 0) {
                                    alert ('Level finished : Refresh page to test again' );
                                }
                            }
                        }
                        if (temptativeDirection_obj && CollisionManager.isAllowed(temptativePosition_point)) {
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

        if (config.type === "playerAvatar") {
            ItemList["playerAvatar"] = [api];
        }
        movingObjectsCounter_num++;
        window.setTimeout(MoveManager, movingObjectsCounter_num*3);
        return api;
    }
};

