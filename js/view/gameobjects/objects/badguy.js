/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
var Configs = require('../config'),
    ObjectListManager = require('../objectlistmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    MovingObject = require('../movingobject'),
    ID_STR = 'badGuy',

    items_array = ObjectListManager.createList(ID_STR);

module.exports = {
    itemList: items_array,
    add: function (point) {

        console.log('point : ', point);
        var
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
        config.reset = function () {
            applyOriginPoint();

        },
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
