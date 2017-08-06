/**
 * Created by Jean-Baptiste on 18/04/2017.
 */
"use strict";
var
    MovingObject = require('../movingobject'),
    UserControls = require('../../../game/ui/usercontrol'),
    QuestionPopup = require('../../ui/questionpopup'),
    IntervalManager = require('../../../game/utils/intervalmanager'),
    ScoreManager = require('../../counters/scoremanager'),
    CollisionManager = require('../collisionmanager'),
    TimoutManager = require('../../../game/utils/timeoutmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    playSound = require('../../../game/utils/playsound'),
    PauseManager = require('../../../game/utils/pausemanager'),
    Configs = require('../config'),
    gridSize_num = Configs('stage').gridSize,
    started_bool = false,
    playerAvatar_obj,
    XLINK_STR = "http://www.w3.org/1999/xlink",
    defaultParams_obj = {
        attr: {
            width: "12",
            height: "12",
            transform: 'translate(-1,-1)',
            overflow: "visible"
        },
        attrNS: [
            {
                "nameSpace": XLINK_STR,
                "name": "href",
                value: "#avatar"
            }
        ]
    },
    lostParams_obj = {
        attr: {
            width: "30",
            height: "30",
            transform: 'translate(-10,-10)'
        },
        attrNS: [
            {
                nameSpace: XLINK_STR,
                name: "href",
                value: "#avatarLost"
            }
        ]
    },
    avatar;
module.exports = {
    isStarted: function () {
        return started_bool;
    },
    add: function () {
        var
            config = Configs('playerAvatar', true),
            restoreDefaultLook = function () {
                SvgUtils.applyAttributes(config.dom_el, defaultParams_obj.attr, defaultParams_obj.attrNS);
            };
        started_bool = false;
        config.dom_el = SvgUtils.createElement('use', defaultParams_obj.attr, defaultParams_obj.attrNS);
        Configs('stage').dom_el.appendChild(config.dom_el);
        config.changeFrame = function (frameId_str, duration_num) {
            SvgUtils.applyAttributes(config.dom_el, null, [
                {
                    nameSpace: XLINK_STR,
                    name: "href",
                    value: frameId_str
                }
            ]);
            if (duration_num) {
                TimoutManager.set(function () {
                    restoreDefaultLook();
                }, duration_num);
            }
        };
        config.setDirection = function (findPos) {
            var
                forbidden_obj,
                direction_obj,
                temptativeDirection_obj,
                temptativePosition_point;

            if (PauseManager.pauseButton) {
                temptativeDirection_obj = UserControls.getDirection(config.position);
                if (temptativeDirection_obj) {
                    temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                }

                var goodie = CollisionManager.isGoodie(temptativePosition_point);
                if (goodie) {
                    var remaining_num = goodie.remove();
                    if (remaining_num === 0) {
                        IntervalManager.clearAll();
                    }
                }
                forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
                if (forbidden_obj && forbidden_obj.open === true) {
                    forbidden_obj = null;
                }

                if (temptativeDirection_obj && !forbidden_obj) {
                    started_bool = true;
                    direction_obj = temptativeDirection_obj;
                    config.targetPosition = temptativePosition_point;
                } else {
                    if (
                        forbidden_obj &&
                        forbidden_obj.type === 'obstacle' &&
                        !forbidden_obj.blocked) {
                        PauseManager.playing = false;
                        config.changeFrame('#avatarQuestion');
                        QuestionPopup.open(forbidden_obj,
                            function (answer_bool) {
                                if (answer_bool !== undefined) {
                                    if (answer_bool) {
                                        config.restoreDefaultLook();
                                    } else {
                                        config.changeFrame('#avatarSad', 2000);
                                    }
                                    forbidden_obj.openDoor(answer_bool);
                                } else {
                                    config.changeFrame('#avatar');
                                }
                                PauseManager.playing = true;
                            }
                        );
                    } else if (forbidden_obj && forbidden_obj.blocked) {
                        playSound('mauvais_2');
                    }
                    direction_obj = null;
                }
                return (direction_obj);
            }
        };
        config.restoreDefaultLook = restoreDefaultLook;
        config.avatarLost = function () {
            started_bool = false;
            playSound('mauvais_1');
            SvgUtils.applyAttributes(config.dom_el, lostParams_obj.attr, lostParams_obj.attrNS);
        };
        playerAvatar_obj = MovingObject.add(config, true);
        playerAvatar_obj.update();
        return playerAvatar_obj;
    }
};
