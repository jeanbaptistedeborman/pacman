/**
 * Created by Jean-Baptiste on 18/04/2017.
 */

var
    MovingObject = require('../movingobject'),
    TimoutManager = require('../../../game/utils/timeoutmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    Configs = require('../config'),
    DEFAULT_FRAME_STR = '#avatar',

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
            transform: 'translate(-10,-10)',
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
    add: function () {
        var
            config = Configs('playerAvatar', true),
            restoreDefaultLook = function () {
                SvgUtils.applyAttributes(config.dom_el, defaultParams_obj.attr, defaultParams_obj.attrNS);
            };
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
        config.restoreDefaultLook = restoreDefaultLook,
            config.avatarLost = function () {
                SvgUtils.applyAttributes(config.dom_el, lostParams_obj.attr, lostParams_obj.attrNS);
            };
        playerAvatar_obj = MovingObject.add(config, true);
        playerAvatar_obj.update();
        return playerAvatar_obj;
    }
};
