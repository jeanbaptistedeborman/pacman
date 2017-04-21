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
        var
            config = JSON.parse(JSON.stringify(Configs(ID_STR))),
            stageConfig = Configs('stage');

        config.position.x = point.x * stageConfig.gridSize;
        config.position.y = point.y * stageConfig.gridSize;
        config.dom_el = SvgUtils.createElement('use', {
            width: "14",
            height: "14",
            transform:'translate(-2,-2)',
            overflow: "visible"
        }, [
            {
                nameSpace: "http://www.w3.org/1999/xlink",
                name: "href",
                value: "#badguy"
            }
        ]);
        config.show = function (visible_bool) {
            if (!visible_bool) {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display':'none'
                });
            } else {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display':'inline'
                });
            }
        };
        stageConfig.dom_el.appendChild(config.dom_el);
        var badGuy_obj = MovingObject.add(config);
        ObjectListManager.pushItem(ID_STR, badGuy_obj);
    }
};
