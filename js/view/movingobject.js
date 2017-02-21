/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    Configs = require('./config.js'),
    IntervalManager = require('../game/utils/intervalmanager');

module.exports = function (configId_str, userControl_bool) {
    var
        UserControls = require('../game/utils/usercontrols'),
        directionPoint = {},
        description_obj = Configs(configId_str),

        position_rect = description_obj.position,
        updatePos = function (point) {
            for (var n in point) {
                position_rect[n] = point[n];
            }
            description_obj.dom_el.setAttribute("x", position_rect.x);
            description_obj.dom_el.setAttribute("x", position_rect.x);
        },
        move = function () {
            var interval = IntervalManager.set(function () {
                updatePos ({x: Number (position_rect.x) +5});
            }, 10);
        };
        move ();
    console.log ("description_obj", description_obj);
    if (userControl_bool) {

    }
    return {
        set pos(point) {
            updatePos(point);
        },
        set moveDirection(point) {
            moveTo(point);
        }
    };
}
