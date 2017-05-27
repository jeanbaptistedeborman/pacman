/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
var Configs = require('../config'),
    ObjectListManager = require('../objectlistmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    MovingObject = require('../movingobject'),
    directionFromTo = require('../../../game/directionfromto'),
    PlayerAvatar = require('./playeravatar');
LivesManager = require('../../counters/livemanager'),
    PauseManager = require('../../../game/utils/pausemanager'),
    CollisionManager = require('../collisionmanager'),
    ID_STR = 'badGuy',
    gridSize_num = Configs('stage').gridSize,
    items_array = ObjectListManager.createList(ID_STR);

module.exports = {
    itemList: items_array,
    add: function (point) {
        var vibrate = (function () {
                var STEP = 0.2,
                    direction = {
                        x:Math.random()>.5?-1:1,
                        y:Math.random()>.5?-1:1
                    },
                    move = {
                        x: -2,
                        y: -2,
                    };
                return function (vibration_num) {
                    if (vibration_num) {
                        move.x = -2 +vibration_num;
                        move.y = -2 +vibration_num;
                    } else {
                        move.x += STEP * direction.x,
                        move.y += STEP * direction.y;
                        if (Math.abs (move.y +2) > STEP*5) {
                            direction.y*=-1;
                        }
                        if (Math.abs (move.x +2) > STEP*10) {
                            direction.x*=-1;
                        }
                    }
                    config.dom_el.setAttribute('transform', 'translate(' + move.x + ',' + move.y + ')');
                }
            }()),
            origin_point = point,
            config = JSON.parse(JSON.stringify(Configs(ID_STR))),
            applyOriginPoint = function () {
                config.position.x = origin_point.x * stageConfig.gridSize;
                config.position.y = origin_point.y * stageConfig.gridSize;
            },
            stageConfig = Configs('stage');
        applyOriginPoint();
        config.dom_el = SvgUtils.createElement('use', {
            width: "14",
            height: "14",
            transform: 'translate(-2,-2)',
            overflow: "visible",
            x: config.position.x,
            y: config.position.y
        }, [
            {
                nameSpace: "http://www.w3.org/1999/xlink",
                name: "href",
                value: "#badguy"
            }
        ]);
        config.setDirection = function (findPos) {
            var
                playerAvatar_api = ObjectListManager.getList('playerAvatar')[0],
                forbidden_obj,
                temptativePosition_point,
                isMySelf = function () {
                    return forbidden_obj.config === config;
                };
            temptativeDirection_obj = directionFromTo(config.position, playerAvatar_api.position);


            temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
            if (PauseManager.playing && CollisionManager.isAvatar(temptativePosition_point)) {
                playerAvatar_api = CollisionManager.isAvatar(temptativePosition_point);
                PauseManager.playing = false;
                playerAvatar_api.config.avatarLost();
                config.show(false);
                window.setTimeout(function () {
                    var badGuys_array = ObjectListManager.getList('badGuy');
                    playerAvatar_api.position = {x: 0, y: 0};
                    config.show(true);
                    badGuys_array.forEach(function (badGuy_mo) {
                        badGuy_mo.config.reset();
                    });
                    playerAvatar_api.config.restoreDefaultLook();
                    LivesManager.decrement();
                    PauseManager.playing = true;
                }, 2000);
            }

            forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
            if (forbidden_obj && isMySelf(forbidden_obj)) {
                forbidden_obj = null;
            }
            if (temptativeDirection_obj && !forbidden_obj) {
                direction_obj = temptativeDirection_obj;
                config.targetPosition = temptativePosition_point;
            } else {
                temptativeDirection_obj = directionFromTo(config.position, playerAvatar_api.position, true);
                temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
                if (temptativeDirection_obj && !forbidden_obj) {
                    direction_obj = temptativeDirection_obj;
                    config.targetPosition = temptativePosition_point;
                } else {
                    direction_obj = null;
                }
            }
            if (!direction_obj || !PlayerAvatar.isStarted()) {
                vibrate();
            } else {
                vibrate (0);
            }
            if (PlayerAvatar.isStarted()) {
                return direction_obj;
            }
        };

        config.reset = function () {
            applyOriginPoint();
        };
        config.show = function (visible_bool) {
            if (!visible_bool) {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display': 'none'
                });
            } else {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display': 'inline'
                });
            }
        };
        stageConfig.dom_el.appendChild(config.dom_el);
        var badGuy_obj = MovingObject.add(config);
        ObjectListManager.pushItem(ID_STR, badGuy_obj);
    },
    resetToOrigins: function () {
        items_array.forEach(function (el) {
            el.reset();
        });
    }
};
