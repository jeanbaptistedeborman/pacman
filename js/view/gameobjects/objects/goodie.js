/**
 * Created by Jean-Baptiste on 25/02/2017.
 */
"use strict";
var
    Config = require('../config'),
    ObjectListManager = require('../objectlistmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    playSound = require('../../../game/utils/playsound'),
    CollisionManager = require('../collisionmanager'),
    stageConfig = Config('stage'),
    onCollected_fun,
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'goodie',
    parent_el = stageConfig.dom_el,
    items_array = ObjectListManager.createList(ID_STR),
    add = function (point) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el;
        config.position = point;
        config.position.width = gridSize_num;
        config.position.height = gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('use', {
                width: 10,
                height: 10,
                x: config.position.x,
                y: config.position.y
            },
            [
                {
                    nameSpace: "http://www.w3.org/1999/xlink",
                    name: "href",
                    value: "#goodie"
                }]);

        config.remove = function () {
            parent_el.removeChild(dom_el);
            items_array = ObjectListManager.disableItemFromList(ID_STR, config);
            if (items_array.length === 0 && onCollected_fun) {
                onCollected_fun();
            }
            playSound('bon_2');
            return items_array.length;
        };
        items_array.push(config);
        parent_el.appendChild(dom_el);
    };
module.exports = {
    set onCollected(fun) {
        onCollected_fun = fun;

    },
    get itemList() {
        return items_array;
    },
    addAll: function () {
        var line_num,
            column_num,
            lineTotal_num = stageConfig.linesNum,
            colTotal_num = stageConfig.columnsNum;
        for (column_num = 0; column_num < colTotal_num; column_num++) {
            for (line_num = 0; line_num < lineTotal_num; line_num++) {
                if (line_num % 15 === 0 && column_num % 15 === 0) {
                    var position_point = {
                        x: column_num * gridSize_num,
                        y: line_num * gridSize_num
                    };
                    if (!CollisionManager.isForbidden(position_point)) {
                        add(position_point);
                    }
                }

            }
        }
    }
};
