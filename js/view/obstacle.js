/**
 * Created by Jean-Baptiste on 25/02/2017.
 */
"use strict";
var
    Config = require('./config'),
    ItemList = require ('./itemlist'),
    SvgUtils = require('../game/utils/svgutils'),
    stageConfig = Config('stage'),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'obstacle',
    items_array = ItemList[ID_STR] = [];
module.exports = {
    get itemList () {
      return items_array;
    },
    add: function (rect) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el;


        config.position.x = rect.x * gridSize_num;
        config.position.y = rect.y * gridSize_num;
        config.position.width = rect.width * gridSize_num;
        config.position.height = rect.height * gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('rect', {
            width: config.position.width,
            height: config.position.height,
            fill: 'red',
            x: config.position.x,
            y: config.position.y
        });
        items_array.push (config);
        stageConfig.dom_el.appendChild(dom_el);
    }
};
