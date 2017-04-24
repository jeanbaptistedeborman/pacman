/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    Config = require('./config'),
    UserControls = require('../../game/ui/usercontrol'),
    IntervalManager = require('../../game/utils/intervalmanager'),
    ObjectListManager = require('./objectlistmanager'),
    directionFromTo = require('../../game/directionfromto'),
    CollisionManager = require('./collisionmanager'),
    QuestionPopup = require('../ui/questionpopup'),
    ScoreManager = require('../../game/scoremanager'),
    LivesManager = require('../../game/livemanager'),
    gridSize_num = Config('stage').gridSize,
    playing_bool = true,
    movingObjectsCounter_num = 0;

module.exports = {
    add: function (config, userControl_bool) {
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
                    var newPos_point = findPos(direction_obj, config.speed * Boolean(playing_bool));
                    updatePos(newPos_point);
                }
            },
            MoveManager = (function () {
                var
                    direction_obj,
                    setDirection = function () {
                        /*
                         * @todo: Refactor :  Better if each type provided his own movement function as parameter
                         *
                         * */
                        var
                            temptativeDirection_obj = null,
                            playerAvatar_api = ObjectListManager.getList('playerAvatar')[0],
                            iAmAvatar_bool = config.type === "playerAvatar",
                            forbidden_obj,
                            temptativePosition_point;
                        if (userControl_bool) {
                            temptativeDirection_obj = UserControls.getDirection(position_rect);
                        }
                        if (config.type === 'badGuy') {
                            playerAvatar_api =
                                temptativeDirection_obj = directionFromTo(position_rect, playerAvatar_api.position);
                        }

                        if (temptativeDirection_obj) {
                            temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                        }

                        if (playing_bool && config.type === "badGuy" && CollisionManager.isAvatar(temptativePosition_point)) {
                            console.log ("arrete playerAvatar_api : ", playerAvatar_api);
                            playerAvatar_api = CollisionManager.isAvatar(temptativePosition_point);
                            playing_bool = false;
                            playerAvatar_api.config.avatarLost ();
                            config.show (false);
                            window.setTimeout(function () {
                                playerAvatar_api.position = {x: 0, y: 0};
                                config.show (true);
                                playerAvatar_api.config.restoreDefaultLook ();
                                LivesManager.decrement();
                                playing_bool = true;
                            }, 2000);
                        }
                        if (iAmAvatar_bool) {
                            var goodie = CollisionManager.isGoodie(temptativePosition_point);
                            if (goodie) {
                                ScoreManager.increment();
                                var remaining_num = goodie.remove();
                                if (remaining_num === 0) {
                                    IntervalManager.clearAll();
                                }
                            }
                        }
                        forbidden_obj = CollisionManager.isForbidden(temptativePosition_point);
                        if (temptativeDirection_obj && !forbidden_obj) {
                            direction_obj = temptativeDirection_obj;
                            config.targetPosition = temptativePosition_point;
                        } else {
                            if (iAmAvatar_bool &&
                                forbidden_obj &&
                                forbidden_obj.type === 'obstacle' && !forbidden_obj.blocked) {
                                playing_bool = false;
                                config.changeFrame('#avatarQuestion');
                                QuestionPopup(forbidden_obj,
                                    function (answer_bool) {
                                        if (answer_bool !== undefined) {
                                            console.log("answer_bool : " + answer_bool);
                                            if (answer_bool) {
                                                config.restoreDefaultLook ();
                                            } else {
                                                config.changeFrame('#avatarSad', 2000);
                                            }
                                            forbidden_obj.openDoor(answer_bool);
                                        } else {
                                            config.changeFrame('#avatar');
                                        }

                                        playing_bool = true;
                                    }
                                );
                            }
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
                /*@ todo :  harmonise : every call to condfig should go through config*/
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
                    console.log('position');
                    updatePos(point);
                },
                set moveDirection(point) {
                    moveTo(point);
                },
                update: function () {
                    console.log('update');
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

