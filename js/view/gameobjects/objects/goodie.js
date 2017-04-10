/**
 * Created by Jean-Baptiste on 25/02/2017.
 */
"use strict";
var
    Config = require('../config'),
    ItemList = require('../itemlist'),
    SvgUtils = require('../../../game/utils/svgutils'),
    CollisionManager = require ('../collisionmanager'),
    ArrayUtils = require ('../../../game/utils/arrayutils'),
    stageConfig = Config('stage'),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'goodie',
    parent_el = stageConfig.dom_el,
    items_array = ItemList[ID_STR] = [],
    add = function (point) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el;
        config.position = point;
        config.position.width = gridSize_num;
        config.position.height = gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('rect', {
            width: 10,
            height: 10,
            fill: 'blue',
            x: config.position.x,
            y: config.position.y
        });
        config.remove = function () {
            dom_el.setAttribute('fill', 'black');
            parent_el.removeChild(dom_el);
            items_array =  ItemList[ID_STR] =  ArrayUtils.remove(items_array, config);
            return items_array.length;
        };
        items_array.push (config);
        parent_el.appendChild(dom_el);
    };
module.exports = {
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
               if (line_num%10 === 0 && column_num%10===  0) {
                   var position_point = {
                       x:column_num*gridSize_num,
                       y:line_num*gridSize_num
                   };
                    if (CollisionManager.isAllowed(position_point)) {
                        add (position_point);
                   }
               }

            }
        }
        console.log ('ItemList :', ItemList);
    }
};
